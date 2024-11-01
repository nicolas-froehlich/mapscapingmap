import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FeatureCollection, Feature } from 'geojson';
import * as L from 'leaflet';
import 'leaflet.markercluster';
// import * as d3 from 'd3';
import 'leaflet/dist/leaflet.css';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
}) 
export class MapComponent implements OnInit, OnChanges {
  // @Input()
  // miningBuffer: number = 0;

  // @Input()
  // ethnicGroupId: number = 1;

  private map!: L.Map;
  //
  private layersControl!: L.Control.Layers;
  private baseLayers: { [key: string]: L.TileLayer } = {};
  private overlayLayers: { [key: string]: L.Layer } = {};

  // private bufferDistances: any[] = [undefined, undefined, undefined, undefined];
  // private ethnicityID: any[] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // //
  isLoading: boolean = true;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.initializeMap();
    console.log('initialized map')
    // this.loadEthnicData(1);
    // this.loadEthnicData(2);
    // this.loadEthnicData(3);
    // this.loadEthnicData(4);
    // this.loadEthnicData(5);
    // this.loadEthnicData(6);
    // // load mining polygons with 0, 3, 5, 10 km buffer
    // this.loadMiningData(0);
    // this.loadMiningData(3);
    // this.loadMiningData(5);
    // this.loadMiningData(10);
    this.loadIntervieweeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes["miningBuffer"]) {
    //   this.updateMapForBuffer(this.miningBuffer);
    // } else if (changes["ethnicGroupId"]) {
    //   this.updateMapForEthnicity(this.ethnicGroupId);
    // }
  }
  
  // updateMapForBuffer(buffer: number): void {
  //   // Remove all mining layers first
  //   Object.values(this.bufferDistances).forEach(layer => {
  //     if (layer && this.map.hasLayer(layer)) {
  //       this.map.removeLayer(layer);
  //     }
  //   });
  
  //   // Add the selected buffer layer if it exists, else load it
  //   if (!this.bufferDistances[buffer]) {
  //     this.loadMiningData(buffer);
  //   } else {
  //     this.map.addLayer(this.bufferDistances[buffer]);
  //     this.updateLayersControl();
  //   }
  // }

  // updateMapForEthnicity(groupID: number): void {
  //   // Remove all mining layers first
  //   Object.values(this.ethnicityID).forEach(layer => {
  //     if (layer && this.map.hasLayer(layer)) {
  //       this.map.removeLayer(layer);
  //     }
  //   });
  
  //   // Add the selected buffer layer if it exists, else load it
  //   if (!this.ethnicityID[groupID]) {
  //     this.loadEthnicData(groupID);
  //   } else {
  //     this.map.addLayer(this.ethnicityID[groupID]);
  //     this.updateLayersControl();
  //   }
  // }


  

  initializeMap(): void {
    // create map and set initial focus + zoom
    this.map = L.map('map', {preferCanvas: true}).setView([8, 8], 2);
    
    // load various baselayer tiles
    const osmTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const topoTiles = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.opentopomap.org">OpenTopoMap</a> contributors',
      maxZoom: 17
    });
    const esriTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Powered by Esri'
    });
    const cartoTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; Carto'
    });

    this.baseLayers = {
      "OSM": osmTiles,
      "Esri (Image)": esriTiles,
      "Topographic": topoTiles,
      "Carto": cartoTiles
    };

    this.baseLayers["Carto"].addTo(this.map);
    this.overlayLayers = {};
    this.layersControl = L.control.layers(this.baseLayers, this.overlayLayers).addTo(this.map);

  }


//   loadEthnicData(ethnic_group: number): void {
//     this.dataService.ethnicData(ethnic_group).subscribe((result: ArrayBuffer) => {
//       parse_georaster(result).then((georaster: any) => {
//         console.log("Fetched Data from backend (real/ethnic):", georaster); // check whether georaster is fine
//         const max = 1;
//         const min = 0;
//         // normalize colours (percentage of ethnic group on total population, therefore 0 to 1)
//         const normalize = (values: number[]) => {
//             if (values[0] < 0) { // no data is any number below zero, make it invisible
//               return '#00000000';
//             } else {
//               const v = (values[0] - min) / (max - min);
//             return d3.interpolatePlasma(v);
//             }
//         }
//         const ethniclayer = new GeoRasterLayer({
//           georaster: georaster,
//           opacity: 0.8,
//           pixelValuesToColorFn: normalize,
//           resolution: 256
//         });
//         // adds ethnic data to overlay layers (dropdown on top right)
//         this.overlayLayers['Ethnic Data'] = ethniclayer;
//         this.ethnicityID[ethnic_group] = ethniclayer;
//         this.updateLayersControl();
//       });

//     });

// }

// ngAfterViewInit() {
//   this.createColorScale();
// }

// createColorScale() {
//   const width = 300; // Adjust as needed
//   const height = 50; // Adjust as needed

//   const svg = d3.select("#color-scale-legend").append("svg")
//       .attr("width", width)
//       .attr("height", height);

//   const gradient = svg.append("defs")
//     .append("linearGradient")
//       .attr("id", "gradient-viridis")
//       .attr("x1", "0%")
//       .attr("x2", "100%")
//       .attr("y1", "0%")
//       .attr("y2", "0%");

//   d3.range(0, 1, 0.01).forEach(function(num) {
//       gradient.append("stop")
//           .attr("offset", `${num * 100}%`)
//           .attr("stop-color", d3.interpolateViridis(num));
//   });

//   svg.append("rect")
//       .attr("width", width)
//       .attr("height", height - 30) // Adjust for labels
//       .style("fill", "url(#gradient-viridis)");

//   svg.append("text")
//       .attr("x", 0)
//       .attr("y", height)
//       .text("0%")
//       .attr("font-size", "12px") // Adjust font size as needed
//       .attr("fill", "#000"); // Adjust text color as needed

//   // Add max label at the end of the gradient
//   svg.append("text")
//       .attr("x", width)
//       .attr("y", height)
//       .attr("text-anchor", "end") // Ensures the text aligns right at the end
//       .text("100%")
//       .attr("font-size", "12px") // Adjust font size as needed
//       .attr("fill", "#000"); // Adjust text color as needed
// }


// loadMiningData(buffer: number): void {
//   this.dataService.miningData(buffer).subscribe({
//     next: (result: FeatureCollection) => {
//       const miningLayer = L.geoJson(result, {
//         style: () => ({
//           color: 'brown',
//           weight: 1,
//           opacity: 1,
//           fillOpacity: 0.5
//         })
//       });

//       this.bufferDistances[buffer] = miningLayer;
//       this.updateLayersControl();

//       this.isLoading = false;
//     },
//     error: (error) => {
//       console.error('Error loading mining areas:', error);
//     }
//   });
// }

// loadConflictData(): void {
//   this.dataService.conflictData().subscribe((result: FeatureCollection) => {
//     console.log("Fetched Data from backend (real/conflictData):", result);
//     const conflictLayer = L.geoJson(result, {
//       onEachFeature: (feature, layer) => {
//         // Optional: Define any interactions here, like popups
//         if (feature.properties) {
//           const { id, type_of_violence, best, dyad_name } = feature.properties;
//           layer.bindPopup(`ID: ${id}, Type of Violence: ${type_of_violence}, Best: ${best}, Dyad Name: ${dyad_name}`);
//         }
//       },
//       pointToLayer: (feature, latlng) => {
//         let color;
//         // Set color based on type_of_violence
//         switch (feature.properties.type_of_violence) {
//           case 1:
//             color = 'red';
//             break;
//           case 2:
//             color = 'green';
//             break;
//           case 3:
//             color = 'blue';
//             break;
//           default:
//             color = 'gray'; // Default color for other or undefined types
//             break;
//         }
//         return L.circleMarker(latlng, {
//           radius: 5,
//           fillColor: color,
//           color: color,
//           weight: 1,
//           opacity: 1,
//           fillOpacity: 0.8
//         });
//       }
//     }).addTo(this.map); // Add the layer directly to the map

//     this.isLoading = false;
//     this.overlayLayers['Conflict Data'] = conflictLayer;
//     this.updateLayersControl();
//   });
// }


loadIntervieweeData(): void {
  this.dataService.intervieweeData().subscribe((result: FeatureCollection) => {
    console.log("Fetched Data from backend (real/interviewees):", result);


    // Create a marker cluster group
    const intervieweeCluster = L.markerClusterGroup();

    const intervieweeLayer = L.geoJson(result
      ,{onEachFeature: (feature, layer) => {
        // Check if the feature has properties
        if (feature.properties) {
          let popupContent = '';
      
          // Loop through each property in the feature's properties
          Object.keys(feature.properties).forEach((key) => {
            // Check if the key is for a link, format as a clickable link
            if (key === 'company_link' || key === 'interviewee_link') {
              if (feature.properties[key]) { // Ensure the link is not null/empty
                popupContent += `<strong>${key}:</strong> <a href="${feature.properties[key]}" target="_blank">Link</a><br>`;
              }
            } else {
              // For other keys, just add them as text
              popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
            }
          });
      
          // Bind the constructed content to the layer's popup
          layer.bindPopup(popupContent);
        }
      }
      
        
      ,
      pointToLayer: (feature, latlng) => {
        let color;
        // Set color based on gender
        switch (feature.properties.gender) {
          case 'm':
            color = 'blue';
            break;
          case 'f':
            color = 'red'
            break;
          case 'n':
            color = 'green'
            break;
        }
        return L.circleMarker(latlng, {
          radius: 10,
          fillColor: color,
          color: color,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    });

    // Step 2: Add the GeoJSON layer to the marker cluster group instead of directly to the map
    intervieweeCluster.addLayer(intervieweeLayer);

    // Step 3: Add the marker cluster group to the map
    this.map.addLayer(intervieweeCluster);

    this.isLoading = false;
    this.overlayLayers['Interviewees'] = intervieweeLayer;
    this.updateLayersControl();
  });
}




  updateLayersControl(): void {
    // Remove the existing control from the map
    this.layersControl.remove();

    // Create a new layersControl with the updated layers and add it to the map
    this.layersControl = L.control.layers(this.baseLayers, this.overlayLayers).addTo(this.map);
  }


}