import os
import numpy as np
import rasterio
from rasterio.windows import Window
from tensorflow.keras.models import load_model
import cv2
import geopandas as gpd
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union
from rasterio.features import shapes
import warnings
warnings.filterwarnings('ignore')

# ================================================================
# INFERENCE CLASSIFICATION
# by Raffi Satya Nugraha
# ================================================================

MODEL_PATH = "model_class.h5"
INPUT_TIF = "clas.tif"
OUTPUT_TIF = "output/class.tif"
OUTPUT_SHP = "output/class.shp"
TILE_SIZE = 128

model = load_model(MODEL_PATH)
NUM_CLASSES = model.output_shape[-1]
print(f"✅ Model loaded with {NUM_CLASSES} output classes.")

with rasterio.open(INPUT_TIF) as src:
    profile = src.profile
    width, height = src.width, src.height
    transform = src.transform
    crs = src.crs

prediction_full = np.zeros((height, width), dtype=np.uint8)

with rasterio.open(INPUT_TIF) as src:
    for y in range(0, height, TILE_SIZE):
        for x in range(0, width, TILE_SIZE):
            w = min(TILE_SIZE, width - x)
            h = min(TILE_SIZE, height - y)
            window = Window(x, y, w, h)
            img = src.read([1, 2, 3], window=window)
            img = np.moveaxis(img, 0, -1)
            img = img.astype(np.uint8)

            pad_x, pad_y = TILE_SIZE - w, TILE_SIZE - h
            img_padded = np.pad(img, ((0, pad_y), (0, pad_x), (0, 0)), mode='reflect')

            pred = model.predict(np.expand_dims(img_padded, axis=0), verbose=0)
            pred_class = np.argmax(pred[0, :h, :w, :], axis=-1).astype(np.uint8)

            prediction_full[y:y + h, x:x + w] = pred_class

prediction_full = cv2.medianBlur(prediction_full, 3)

from skimage import morphology

mask_building = (prediction_full == 1).astype(np.uint8)
kernel = np.ones((3, 3), np.uint8)
mask_building = cv2.morphologyEx(mask_building, cv2.MORPH_OPEN, kernel)
mask_building = morphology.remove_small_holes(mask_building.astype(bool), 64)
mask_building = morphology.remove_small_objects(mask_building, 64)
mask_building = mask_building.astype(np.uint8)

prediction_full[prediction_full == 1] = 0
prediction_full += mask_building * 1

profile.update({
    "count": 1,
    "dtype": rasterio.uint8,
    "compress": "lzw"
})
with rasterio.open(OUTPUT_TIF, "w", **profile) as dst:
    dst.write(prediction_full, 1)

print(f"✅ Saved predicted GeoTIFF: {OUTPUT_TIF}")

mask = prediction_full > 0
results = (
    {'properties': {'class': int(v)}, 'geometry': s}
    for s, v in shapes(prediction_full, mask=mask, transform=transform)
)
geoms = list(results)
if len(geoms) == 0:
    raise ValueError("No objects detected.")

gdf = gpd.GeoDataFrame.from_features(geoms, crs=crs)

from shapely.affinity import rotate

def rectangularize(geom, simplify_tol=0.8, min_area=5):
    if geom.area < min_area:
        return None
    geom = geom.simplify(simplify_tol, preserve_topology=True)
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
    return rect_back

gdf['geometry'] = gdf['geometry'].apply(rectangularize)
gdf = gdf[gdf['geometry'].notnull()]
gdf = gdf[gdf.area > 5]
gdf = gdf.explode(index_parts=False, ignore_index=True)
gdf['geometry'] = gdf['geometry'].buffer(-0.3)
merged = unary_union(gdf.geometry)

if isinstance(merged, MultiPolygon):
    polys = list(merged.geoms)
elif isinstance(merged, Polygon):
    polys = [merged]
else:
    raise TypeError("Unexpected geometry type after union")

gdf_clean = gpd.GeoDataFrame(geometry=polys, crs=gdf.crs)
gdf_clean = gdf_clean[gdf_clean.area > 5].reset_index(drop=True)
gdf_clean['geometry'] = gdf_clean['geometry'].buffer(0.3)

def remove_overlaps_precisely(gdf, class_field="class"):
    gdf = gdf.copy().reset_index(drop=True)
    cleaned_geoms, cleaned_classes = [], []
    for i in range(len(gdf)):
        geom_i = gdf.loc[i, "geometry"]
        kelas_i = gdf.loc[i, class_field]
        for g_prev in cleaned_geoms:
            if geom_i.intersects(g_prev):
                geom_i = geom_i.difference(g_prev)
        if not geom_i.is_empty:
            cleaned_geoms.append(geom_i)
            cleaned_classes.append(kelas_i)
    return gpd.GeoDataFrame({class_field: cleaned_classes, "geometry": cleaned_geoms}, crs=gdf.crs)

gdf_no_overlap = remove_overlaps_precisely(gdf, class_field="class")
gdf_no_overlap = gdf_no_overlap[gdf_no_overlap.area > 5].reset_index(drop=True)
gdf_no_overlap = gdf_no_overlap[gdf_no_overlap.geometry.type.isin(["Polygon", "MultiPolygon"])].copy()
gdf_no_overlap = gdf_no_overlap[gdf_no_overlap.is_valid & ~gdf_no_overlap.geometry.is_empty].reset_index(drop=True)

OUTPUT_SHP_CLEAN = "output/class.shp"
gdf_no_overlap.to_file(OUTPUT_SHP_CLEAN)
print(f"✅ Saved shapefile (rectangular, no overlap, class preserved): {OUTPUT_SHP_CLEAN}")
