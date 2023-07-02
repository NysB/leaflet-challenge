// Create the map
var map = L.map('map').setView([0, 0], 2);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

// Define marker 
function getMarkerOptions(magnitude, depth) {
  var markerSize = magnitude * 3;
  var markerColor = 'hsl(0, 100%, ' + (100 - depth * 5) + '%)';

  return {
    radius: markerSize,
    fillColor: markerColor,
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
}

// API call to retrieve earthquake data

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(function (data) {
    var features = data.features;

    features.forEach(function (feature) {
      var magnitude = feature.properties.mag;
      var location = feature.properties.place;
      var latitude = feature.geometry.coordinates[1];
      var longitude = feature.geometry.coordinates[0];
      var depth = feature.geometry.coordinates[2];
      var url = feature.properties.url;

      var markerOptions = getMarkerOptions(magnitude, depth);

      var marker = L.circleMarker([latitude, longitude], markerOptions)
        .bindPopup('<b>Magnitude:</b> ' + magnitude +
          '<br><b>Location:</b> ' + location +
          '<br><b>Depth:</b> ' + depth +
          '<br><a href="' + url + '" target="_blank">More info</a>');

      marker.addTo(map);
    });
  })
  .catch(function (error) {
    console.log('Error:', error);
  });

// Create legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML = '<h4>Legend</h4>' +
    '<div class="legend-item"><span class="dot"></span> Magnitude</div>' +
    '<div class="legend-item"><span class="dot" style="background-color: hsl(0, 100%, 0%)"></span> Shallow Depth (0-20 km)</div>' +
    '<div class="legend-item"><span class="dot" style="background-color: hsl(0, 100%, 50%)"></span> Moderate Depth (20-50 km)</div>' +
    '<div class="legend-item"><span class="dot" style="background-color: hsl(0, 100%, 100%)"></span> Deep Depth (>50 km)</div>';
  return div;
};
legend.addTo(map);
