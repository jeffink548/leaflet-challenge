// Create the map
var map = L.map('map').setView([0, 0], 2);

// Add the tile layer (base map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Load the earthquake data from the new URL
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson').then(function(data) {
  // Process each earthquake feature
  data.features.forEach(function(feature) {
    var lat = feature.geometry.coordinates[1];
    var lon = feature.geometry.coordinates[0];
    var depth = feature.geometry.coordinates[2];
    var magnitude = feature.properties.mag;
    var place = feature.properties.place;

    // Define marker size based on magnitude
    var markerSize = magnitude * 5;

    // Define marker color based on depth
    var markerColor = getColor(depth);

    // Create a circle marker for each earthquake
    var marker = L.circleMarker([lat, lon], {
      radius: markerSize,
      fillColor: markerColor,
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map);

    // Create a popup with additional information
    var popupContent = `<strong>Place:</strong> ${place}<br>
                        <strong>Magnitude:</strong> ${magnitude}<br>
                        <strong>Depth:</strong> ${depth} km`;
    marker.bindPopup(popupContent);
  });

  // Create a legend
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    var labels = ['<strong>Depth Legend</strong>'];
    var depths = [0, 10, 30, 50, 70, 90];
    var colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

    for (var i = 0; i < depths.length; i++) {
      var label = depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+ km');
      var color = colors[i];
      labels.push(`<span class="legend-item" style="background-color: ${color};"></span> ${label}`);
    }
    div.innerHTML = labels.join('<br>');

    return div;
  };
  legend.addTo(map);
});

// Function to determine marker color based on depth
function getColor(depth) {
  if (depth < 10) {
    return '#1f77b4';
  } else if (depth < 30) {
    return '#ff7f0e';
  } else if (depth < 50) {
    return '#2ca02c';
  } else if (depth < 70) {
    return '#d62728';
  } else if (depth < 90) {
    return '#9467bd';
  } else {
    return '#8c564b';
  }
}
