mapboxgl.accessToken = 'pk.eyJ1IjoicGNvcnJpZ2FuIiwiYSI6ImNrODBuaHZiczAxZXEzZm50ajJ1cmNmODAifQ.S2Ulj4k43LOsWREjSj4M6g';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/pcorrigan/ck80nm4q20mr71iqj771bivp8?optimize=true',
  center: [-111.5, 39.5],
  zoom: 6
});

//Scale bar    
var scale = new mapboxgl.ScaleControl({
    maxWidth: 200,
    unit: 'imperial'
});

map.addControl(scale);  

    // add markers to map
var geoJSON = <%-JSON.stringify(mapPoints)%>;
    
geoJSON.features.forEach(function(marker) { 

  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<span>' + marker.properties.name + '</span><p>' + marker.properties.agency + '</p>'))    
    .addTo(map);
});
    

     