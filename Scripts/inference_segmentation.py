import os
import numpy as np
import rasterio
from rasterio.windows import Window
from rasterio.features import shapes
from tensorflow.keras.models import load_model
import cv2
import geopandas as gpd
from shapely.geometry import shape, Polygon, MultiPolygon
from shapely.ops import unary_union
from shapely.affinity import rotate
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

# ================================================================
# INFERENCE CLASSIFICATION
# by Raffi Satya Nugraha
# ================================================================

# ==== CONFIGURATION ====
MODEL_PATH = "model_seg.h5"
INPUT_TIF = "seg.tif"
OUTPUT_TIF = "output/seg.tif"
OUTPUT_SHP = "/seg.shp"

TILE_SIZE = 128
MIN_AREA = 5
NEG_BUFFER = 0.3
THRESHOLD = 0.5

# ==== LOAD MODEL ====
model = load_model(MODEL_PATH)
NUM_CLASSES = model.output_shape[-1]
print(f"✅ Model loaded with output shape: {model.output_shape}")

# ==== OPEN INPUT RASTER ====
with rasterio.open(INPUT_TIF) as src:
    profile = src.profile.copy()
    width, height = src.width, src.height
    transform = src.transform
    crs = src.crs

# ==== PREDICTION ====
prediction_full = np.zeros((height, width), dtype=np.uint8)

with rasterio.open(INPUT_TIF) as src:
    for y in range(0, height, TILE_SIZE):
        for x in range(0, width, TILE_SIZE):
            w, h = min(TILE_SIZE, width - x), min(TILE_SIZE, height - y)
            window = Window(x, y, w, h)
            img = src.read([1, 2, 3], window=window)
            img = np.moveaxis(img, 0, -1).astype(np.uint8)
            img_padded = np.pad(img, ((0, TILE_SIZE - h), (0, TILE_SIZE - w), (0, 0)), mode='reflect')

            pred = model.predict(np.expand_dims(img_padded, axis=0), verbose=0)
            if NUM_CLASSES == 1:
                pred_class = (pred[0, :h, :w, 0] > THRESHOLD).astype(np.uint8)
            elif NUM_CLASSES == 2:
                pred_class = np.argmax(pred[0, :h, :w, :], axis=-1).astype(np.uint8)
            else:
                raise ValueError("❌ Model output must be 1 or 2 channels for binary segmentation.")

            prediction_full[y:y + h, x:x + w] = pred_class

prediction_full = cv2.medianBlur(prediction_full, 3)

# ==== SAVE PREDICTED TIF ====
profile.update({"count": 1, "dtype": rasterio.uint8, "compress": "lzw"})
with rasterio.open(OUTPUT_TIF, "w", **profile) as dst:
    dst.write(prediction_full, 1)
print(f"✅ Saved predicted GeoTIFF: {OUTPUT_TIF}")

# ==== RECTANGULARIZATION ====
def rectangularize(geom, simplify_tol=0.8, min_area=MIN_AREA):
    if geom is None or geom.is_empty or geom.area < min_area:
        return None
    geom = geom.simplify(simplify_tol, preserve_topology=True)
    try:
        min_rect = geom.minimum_rotated_rectangle
        x, y = min_rect.exterior.coords.xy
        dx, dy = x[1] - x[0], y[1] - y[0]
        angle = np.degrees(np.arctan2(dy, dx))
        rotated = rotate(geom, -angle, origin='centroid', use_radians=False)
        bounds = rotated.bounds
        rect = Polygon([
            (bounds[0], bounds[1]),
            (bounds[2], bounds[1]),
            (bounds[2], bounds[3]),
            (bounds[0], bounds[3])
        ])
        rect_back = rotate(rect, angle, origin='centroid', use_radians=False)
        if rect_back.is_valid and rect_back.area >= min_area:
            return rect_back
    except Exception:
        return None
    return None

def remove_overlaps_preserve_class(gdf, class_field="class"):
    gdf = gdf.copy().reset_index(drop=True)
    cleaned_geoms, cleaned_classes = [], []
    order = np.argsort(-gdf.geometry.area)
    for idx in order:
        geom_i = gdf.loc[idx, "geometry"]
        kelas_i = gdf.loc[idx, class_field]
        for g_prev in cleaned_geoms:
            if geom_i.intersects(g_prev):
                geom_i = geom_i.difference(g_prev)
                if geom_i.is_empty:
                    break
        if geom_i.is_empty:
            continue
        if isinstance(geom_i, MultiPolygon):
            for part in geom_i.geoms:
                if part.area >= MIN_AREA:
                    cleaned_geoms.append(part)
                    cleaned_classes.append(kelas_i)
        elif geom_i.area >= MIN_AREA:
            cleaned_geoms.append(geom_i)
            cleaned_classes.append(kelas_i)
    return gpd.GeoDataFrame({class_field: cleaned_classes, "geometry": cleaned_geoms}, crs=gdf.crs)

# ==== POLYGONIZATION ====
print("🧱 Extracting and rectangularizing building polygons...")
mask = (prediction_full == 1).astype(np.uint8)
results = ({'properties': {'class': 1}, 'geometry': s} for s, v in shapes(prediction_full, mask=mask, transform=transform))
geoms = list(results)
if len(geoms) == 0:
    raise ValueError("❌ No object polygons found.")

gdf_c = gpd.GeoDataFrame.from_features(geoms, crs=crs)
gdf_c = gdf_c[gdf_c['class'] == 1].reset_index(drop=True)
gdf_c['geometry'] = gdf_c['geometry'].apply(lambda g: rectangularize(g, simplify_tol=0.8))
gdf_c = gdf_c[gdf_c['geometry'].notnull()]
gdf_c = gdf_c[gdf_c.geometry.area >= MIN_AREA].reset_index(drop=True)

try:
    gdf_c['geometry'] = gdf_c['geometry'].buffer(-NEG_BUFFER)
    gdf_c = gdf_c[gdf_c.geometry.notnull() & (~gdf_c.geometry.is_empty)]
except Exception:
    pass

merged = unary_union(gdf_c.geometry)
if isinstance(merged, Polygon):
    polys = [merged]
elif isinstance(merged, MultiPolygon):
    polys = list(merged.geoms)
else:
    polys = [merged]

gdf_c = gpd.GeoDataFrame({'class': [1]*len(polys), 'geometry': polys}, crs=crs)
gdf_c_clean = remove_overlaps_preserve_class(gdf_c, class_field='class')

try:
    gdf_c_clean['geometry'] = gdf_c_clean['geometry'].buffer(NEG_BUFFER)
    gdf_c_clean = gdf_c_clean[gdf_c_clean.geometry.area >= MIN_AREA]
except Exception:
    pass

gdf_final = gdf_c_clean.copy()
gdf_final['geometry'] = gdf_final['geometry'].buffer(0)
gdf_final = gdf_final[gdf_final.geometry.notnull() & (~gdf_final.geometry.is_empty)]

# ==== SAVE FINAL SHAPEFILE ====
gdf_final.to_file(OUTPUT_SHP)
print(f"✅ Saved shapefile (rectangular, no-overlap, class preserved): {OUTPUT_SHP}")
print("📊 Class counts:")
print(gdf_final['class'].value_counts())
