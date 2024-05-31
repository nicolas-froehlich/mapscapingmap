#!/bin/bash

# we are now inside the linux environment of our PostGIS container
echo "Hi from the import script"

# add any code here (e.g. osm2pgsql or ogr2ogr imports) 

# explanation of flags
# -C: Creates the raster table and ensures that constraints are applied. Constraints include nodata values, ensuring that the raster data adheres to expected null value representations.
# -a: Appends data to an existing table. Used here for importing additional datasets after the initial table creation
# -I: Creates a GiST index on the raster column (rast). Indexes can significantly improve performance on spatial queries, such as finding rasters that intersect with a given geometry.
# -M: Adds support for using out-of-db rasters and registers the raster columns in the raster_columns view. This option is useful for managing large datasets by allowing data to be stored outside the database, yet still be queryable.

# raster2pgsql -s 4326 -C /importdata/side_v1_248_1.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/side_v1_248_2.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/side_v1_248_3.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -I -M -a /importdata/side_v1_248_4.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432

# raster2pgsql -s 4326 -C /importdata/Congo_2014_bakongo_nord_sud.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Congo_2014_bas_kasai_et_kwilu_kwngo.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Congo_2014_basele_k_man_et_kivu.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Congo_2014_cuvette_central.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -a /importdata/Congo_2014_kasai_katanga_tanganika.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432
# raster2pgsql -s 4326 -I -M -a /importdata/Congo_2014_lunda.tif side | psql -d johndoe_db -U johndoe -h localhost -p 5432





echo "Import script execution completed"