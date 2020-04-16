
    
mapboxgl.accessToken = 'pk.eyJ1IjoicGNvcnJpZ2FuIiwiYSI6ImNrODBuaHZiczAxZXEzZm50ajJ1cmNmODAifQ.S2Ulj4k43LOsWREjSj4M6g';

var coordinates = document.getElementById('coordinates');
var map = new mapboxgl.Map({
container: 'mapdiv',
  style: 'mapbox://styles/pcorrigan/ck80nm4q20mr71iqj771bivp8?optimize=true',
  center: [-111.5, 39.5],
  zoom: 6
});


var canvas = map.getCanvasContainer();
 
var geojson = {
    'type': 'FeatureCollection',
    'features': [{
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [-111.5, 39.5]
        }
    }]
};
 
function onMove(e) {
    var coords = e.lngLat;

    // Set a UI indicator for dragging.
    canvas.style.cursor = 'grabbing';

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    map.getSource('point').setData(geojson);
    
    document.getElementById("inputLong").value=coords.lng.toFixed(3);
    document.getElementById("inputLat").value=coords.lat.toFixed(3);
    
}
 
function onUp(e) {
    var coords = e.lngLat;

//     Print the coordinates of where the point had
//     finished being dragged to on the map.
//     coordinates.style.display = 'block';
//     coordinates.innerHTML =
//         'Longitude: ' + coords.lng + '<br />Latitude: ' + coords.lat;
//     canvas.style.cursor = '';

    // Unbind mouse/touch events
    map.off('mousemove', onMove);
    map.off('touchmove', onMove);
}
    
function onType(e) {
    var coords = e.lngLat;
    console.log("onType triggered")
    //change the position of the point if numbers are typed in the lat or long box
    var typedLng=document.getElementById("inputLong").value;
    var typedLat=document.getElementById("inputLat").value;
    geojson.features[0].geometry.coordinates = [typedLng, typedLat];
    
}    
 
map.on('load', function() {
// Add a single point to the map
map.addSource('point', {
'type': 'geojson',
'data': geojson
});
 
map.addLayer({
    'id': 'point',
    'type': 'circle',
    'source': 'point',
    'paint': {
        'circle-radius': 10,
        'circle-color': 'red'
    }
});
 
// When the cursor enters a feature in the point layer, prepare for dragging.
map.on('mouseenter', 'point', function() {
map.setPaintProperty('point', 'circle-color', 'orange');
canvas.style.cursor = 'move';
});
 
map.on('mouseleave', 'point', function() {
map.setPaintProperty('point', 'circle-color', 'green');
canvas.style.cursor = '';
});
 
map.on('mousedown', 'point', function(e) {
// Prevent the default map drag behavior.
e.preventDefault();
 
canvas.style.cursor = 'grab';
 
map.on('mousemove', onMove);
map.once('mouseup', onUp);
});
 
map.on('touchstart', 'point', function(e) {
if (e.points.length !== 1) return;
 
// Prevent the default map drag behavior.
e.preventDefault();
 
map.on('touchmove', onMove);
//map.once('touchend', onUp);
    

        
});
});
$("inputLong").change(onType);
$("inputLat").change(onType);
