-- copy data from file into the database

DROP TABLE IF EXISTS interviewees;
CREATE TABLE IF NOT EXISTS interviewees (
    "Episode"               integer, -- int64 in pandas
    "Date"                  date, -- object in pandas, likely best represented as text
    "Title"                 text, -- object in pandas, text data type
    "Duration"              text, -- object in pandas, text data type for durations as strings
    "Categories"            text, -- object in pandas, nullable so text is suitable
    "first_name"            text, -- object in pandas, nullable so text is suitable
    "last_name"             text, -- object in pandas, nullable so text is suitable
    "interviewee_link"      text, -- object in pandas, URL as text
    "gender"                text, -- object in pandas, nullable so text is suitable
    "position"              text, -- object in pandas, nullable so text is suitable
    "company_name"          text, -- object in pandas, nullable so text is suitable
    "company_link"          text, -- object in pandas, URL as text
    "location"              text, -- object in pandas, location as text
    "latitude"              numeric, -- float64 in pandas, numeric for precision
    "longitude"             numeric, -- float64 in pandas, numeric for precision
    "full_name"             text,
    "number_of_interviews"  numeric
);



COPY interviewees (
    "Episode",
    "Date",
    "Title",
    "Duration",
    "Categories",
    "first_name",
    "last_name",
    "interviewee_link",
    "gender",
    "position",
    "company_name",
    "company_link",
    "location",
    "latitude",
    "longitude",
    "full_name",
    "number_of_interviews"
) FROM '/importdata/geocoded_addresses.tsv' WITH (FORMAT CSV, DELIMITER E'\t', HEADER, NULL '');

-- Generate the geometry for each point in geocoded_addresses.tsv
-- UPDATE interviewees
-- SET geometry = ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326);

-- Jitter the geometry by approximately 1km
-- UPDATE interviewees
-- SET geometry = ST_Translate(geometry, 
--                             RANDOM() * 0.018 - 0.009,  -- Longitude shift, produces a value between -0.009 and 0.009
--                             RANDOM() * 0.018 - 0.009); -- Latitude shift, same range as above






-- -- drop & create a table for mining data
-- DROP TABLE IF EXISTS mining_polygons;
-- CREATE TABLE IF NOT EXISTS mining_polygons (
--     "geom" geometry(Polygon, 4326),
--     "ISO3_CODE" character(3),
--     "COUNTRY_NAME" character(40),
--     "AREA" float
-- );

-- -- conflict data
-- DROP TABLE IF EXISTS afr_09_ucdp;
-- CREATE TABLE IF NOT EXISTS afr_09_ucdp (
--     "id" numeric,
--     "latitude" numeric,
--     "longitude" numeric,
--     "type_of_violence" integer,
--     "best" integer,
--     "dyad_name" character varying,
--     "location" geometry(Point, 4326)
-- );


-- -- Copy the data for afr_09_ucdp with additional columns
-- copy afr_09_ucdp ("id", "latitude", "longitude", "type_of_violence", "best", "dyad_name") from '/importdata/afr_09_ucdp.csv' with (FORMAT CSV, HEADER, NULL '');

-- -- Generate the geometry for each point in afr_09_ucdp
-- UPDATE afr_09_ucdp
-- SET location = ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326);


-- -- copy from csv file into postgis table
-- copy mining_polygons ("geom", "ISO3_CODE", "COUNTRY_NAME", "AREA") from '/importdata/mining_polygons.csv' with (FORMAT CSV, HEADER 1, NULL '');

-- -- add columns for calculating the buffers
-- ALTER TABLE mining_polygons
-- ADD COLUMN "geom_buffer_3km" geometry(Polygon, 4326),
-- ADD COLUMN "geom_buffer_5km" geometry(Polygon, 4326),
-- ADD COLUMN "geom_buffer_10km" geometry(Polygon, 4326);


-- -- Use World Mercator (EPSG:3857) which allows buffering in meters
-- UPDATE mining_polygons
-- SET "geom_buffer_3km" = ST_Transform(
--                             ST_Buffer(
--                                 ST_Transform("geom", 3857), -- Transform geom to EPSG:3857
--                                 3000 -- Buffer distance in meters
--                             ), 
--                             4326 -- Transform back to EPSG:4326
--                         );

-- UPDATE mining_polygons
-- SET "geom_buffer_5km" = ST_Transform(
--                             ST_Buffer(
--                                 ST_Transform("geom", 3857), -- Transform geom to EPSG:3857
--                                 5000 -- Buffer distance in meters
--                             ), 
--                             4326 -- Transform back to EPSG:4326
--                         );

-- UPDATE mining_polygons
-- SET "geom_buffer_10km" = ST_Transform(
--                             ST_Buffer(
--                                 ST_Transform("geom", 3857), -- Transform geom to EPSG:3857
--                                 10000 -- Buffer distance in meters
--                             ), 
--                             4326 -- Transform back to EPSG:4326
--                         );

-- ALTER TABLE mining_polygons RENAME COLUMN "geom" TO "geom_buffer_0km";
