import os
import random
import shutil
from tqdm import tqdm
from PIL import Image
import numpy as np

# ================================================================
# DATA PREPROCESSING
# by Raffi Satya Nugraha
# ================================================================

def make_tiles(image_dir, mask_dir, output_dir, tile_size=256, overlap=64):
    os.makedirs(output_dir, exist_ok=True)
    image_files = sorted(os.listdir(image_dir))

    for img_name in tqdm(image_files, desc="🔹 Tiling data"):
        base_name = os.path.splitext(img_name)[0]
        img_path = os.path.join(image_dir, img_name)
        mask_path = os.path.join(mask_dir, img_name)
        if not os.path.exists(mask_path):
            print(f"⚠️ Mask {mask_path} not found, skipped.")
            continue

        img = Image.open(img_path).convert("RGB")
        mask = Image.open(mask_path).convert("L")
        w, h = img.size
        step = tile_size - overlap
        count = 0

        for top in range(0, h, step):
            for left in range(0, w, step):
                right = min(left + tile_size, w)
                bottom = min(top + tile_size, h)
                if right - left < tile_size or bottom - top < tile_size:
                    continue
                box = (left, top, right, bottom)
                img_tile = img.crop(box)
                mask_tile = mask.crop(box)

                img_tile.save(os.path.join(output_dir, f"{base_name}_{count:04d}_image.png"))
                mask_tile.save(os.path.join(output_dir, f"{base_name}_{count:04d}_mask.png"))
                count += 1

    print(f"✅ Tiling completed: {output_dir}")


def compute_balance(mask_dir):
    mask_files = [f for f in os.listdir(mask_dir) if f.endswith('_mask.png')]
    if not mask_files:
        print(f"⚠️ No mask files found in: {mask_dir}")
        return 0.0, 0.0

    total_pixels = total_ones = 0
    for m in tqdm(mask_files, desc=f"🔎 Checking balance ({os.path.basename(mask_dir)})"):
        mask = np.array(Image.open(os.path.join(mask_dir, m)).convert("L"))
        mask_bin = (mask > 0).astype(np.uint8)
        total_ones += mask_bin.sum()
        total_pixels += mask_bin.size

    ratio_ones = total_ones / total_pixels if total_pixels > 0 else 0
    return ratio_ones, 1 - ratio_ones


def balance_dataset(folder):
    print(f"\n⚖️ Balancing dataset in: {folder}")
    mask_files = [f for f in os.listdir(folder) if f.endswith('_mask.png')]
    if not mask_files:
        print("⚠️ No masks for balancing.")
        return

    keep_files = []
    for m in mask_files:
        mask = np.array(Image.open(os.path.join(folder, m)).convert("L"))
        ratio = np.mean(mask > 0)
        if 0.2 <= ratio <= 0.8:
            keep_files.append(m)

    to_remove = set(mask_files) - set(keep_files)
    for m in tqdm(to_remove, desc="🧹 Removing unbalanced patches"):
        base = m.replace('_mask.png', '_image.png')
        for f in [m, base]:
            path = os.path.join(folder, f)
            if os.path.exists(path):
                os.remove(path)

    print(f"✅ Balanced dataset: {len(keep_files)} patches remaining.")


def split_dataset(all_tiles_dir, train_ratio=0.8):
    train_dir = os.path.join(all_tiles_dir, "train")
    test_dir = os.path.join(all_tiles_dir, "test")
    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(test_dir, exist_ok=True)

    all_images = [f for f in os.listdir(all_tiles_dir) if f.endswith('_image.png')]
    random.shuffle(all_images)

    n_train = int(len(all_images) * train_ratio)
    for i, img_name in enumerate(tqdm(all_images, desc="✂️ Splitting data", unit="tile")):
        split = train_dir if i < n_train else test_dir
        mask_name = img_name.replace('_image.png', '_mask.png')
        for f in [img_name, mask_name]:
            src = os.path.join(all_tiles_dir, f)
            if os.path.exists(src):
                shutil.copy(src, os.path.join(split, f))

    print(f"✅ Split completed → Train: {n_train}, Test: {len(all_images) - n_train}")


if __name__ == "__main__":
    image_dir = "data/images"
    mask_dir = "data/labels_atap"
    tiled_dir = "data/tiles_atap"

    make_tiles(image_dir, mask_dir, tiled_dir, tile_size=128, overlap=64)
    split_dataset(tiled_dir, train_ratio=0.8)

    for subset in ["train", "test"]:
        subset_dir = os.path.join(tiled_dir, subset)
        print(f"\n📊 Checking balance for subset: {subset}")
        ratio_ones, ratio_zeros = compute_balance(subset_dir)
        print(f"   → Class 1: {ratio_ones:.2%}, Class 0: {ratio_zeros:.2%}")

        if abs(ratio_ones - ratio_zeros) > 0.1:
            print(f"⚠️ Unbalanced, balancing {subset}...")
            balance_dataset(subset_dir)
            ratio_ones, ratio_zeros = compute_balance(subset_dir)
            print(f"✅ After balancing → Class 1: {ratio_ones:.2%}, Class 0: {ratio_zeros:.2%}")
        else:
            print("✅ Already balanced.")
