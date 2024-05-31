This is the code for creating a map that shows locations and additional information about all of Daniel's interview partners in the MapScaping podcast.

It contains:
* a ```Python Notebook``` for scraping & preprocessing the data
* a map app consisting of
  * an ```Angular``` frontend
  * a ```python flask``` backend
  * a ```PostGIS``` database for interactive displaying

⚠️ it's work in progress, some functionalities don't work yet ⚠️ 

### Setup
Assuming you have ```Docker``` installed and running on your machine:
1. in your console, navigate to the folder 'mapscaping-map'
2. enter ```docker compose up```
3. after waiting a few seconds, call the url `localhost:4200` in your browser
