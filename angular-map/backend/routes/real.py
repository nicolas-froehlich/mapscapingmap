from flask import Blueprint, jsonify, abort, current_app, request, send_file
import base64
import json
import os
import io

# register the blueprint
real_routes = Blueprint('real', __name__, url_prefix='/real')


@real_routes.route('/basic')
def basic_test():
    return jsonify("Test successful!"), 200

# @real_routes.route('/mining')
# def db_mining_route():
#     try:
#         # simplify buffer polygons to make the app faster
#         # get the db_manager from the app context
#         miningBuffer = request.args.get("buffer", 0)
#         column_name = f"geom_buffer_{miningBuffer}km"  # miningBuffer should be validated to avoid SQL injections
#         query = f"""
#             SELECT ST_AsGeoJSON(ST_Simplify("{column_name}", 0.0001))::jsonb FROM mining_polygons
#         """
        
#         db_manager = current_app.config['DB_MANAGER']
#         result = db_manager.execute_query(query)

#         geojson = []
#         for r in result:
#             geojson.append({
#                 "type": "Feature",
#                 "geometry": r[0]
#             })

#     except Exception as e:
#         abort(500, description=e)  

#     return jsonify({
#         "type": "FeatureCollection", "features": geojson
#     }), 200


# @real_routes.route('/ethnic')
# def db_ethnic_route():
#     ethnic_group = request.args.get("ethnic_group", 1)
#     query = f'''
#         select ST_AsTIFF(rast) FROM side WHERE rid = {ethnic_group}
#     '''
#     db_manager = current_app.config['DB_MANAGER']
#     result = db_manager.execute_query(query)

#     return send_file(
#         io.BytesIO(result[0][0]),
#         mimetype='image/tiff',
#         as_attachment=False,
#         download_name='ethnic.tif')


# @real_routes.route('/interviewees')
# def db_interviewees_route():
#     try:
#         # Adjusted query to select additional columns
#         query = """
#             SELECT "location",
#                    ST_AsGeoJSON(ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326))::jsonb AS geometry
#             FROM interviewees"""
#         db_manager = current_app.config['DB_MANAGER']
#         result = db_manager.execute_query(query)
#         geojson = []
#         for r in result:
#             # Include additional columns in the properties of the GeoJSON feature
#             geojson.append({
#                 "type": "Feature",
#                 "properties": {
#                     "location": r[0]
#                 },
#                 "geometry": r[1]
#             })
#     except Exception as e:
#         abort(500, description=str(e))
#     return jsonify({
#         "type": "FeatureCollection", "features": geojson
#     }), 200


@real_routes.route('/interviewees')
def db_interviewees_route():
    try:
        # Adjusted query to select additional columns
        query = """
            SELECT "Episode", "Date", "Title", "Duration", "Categories",
                "first_name", "last_name", "interviewee_link", "gender", 
                "position", "company_name", "company_link", "location",
                "full_name", "number_of_interviews",
                ST_AsGeoJSON(
                    ST_Translate(
                        ST_SetSRID(
                            ST_MakePoint("longitude", "latitude"),
                            4326),
                        RANDOM() * 0.018 - 0.009, -- Longitude jitter
                        RANDOM() * 0.018 - 0.009  -- Latitude jitter
                    )
                )::jsonb AS geometry
            FROM interviewees"""

        db_manager = current_app.config['DB_MANAGER']
        result = db_manager.execute_query(query)
        geojson = []
        for r in result:
            # Include additional columns in the properties of the GeoJSON feature
            properties = {
                "Episode": r[0],
                "Date": r[1],
                "Title": r[2],
                "Duration": r[3],
                "Categories": r[4],
                "first_name": r[5],
                "last_name": r[6],
                "interviewee_link": r[7],
                "gender": r[8],
                "position": r[9],
                "company_name": r[10],
                "company_link": r[11],
                "location": r[12],
                "full_name": r[13],
                "number_of_interviews": r[14]
            }
            geojson.append({
                "type": "Feature",
                "properties": properties,
                "geometry": r[15]
            })
    except Exception as e:
        abort(500, description=str(e))
    return jsonify({
        "type": "FeatureCollection", "features": geojson
    }), 200
