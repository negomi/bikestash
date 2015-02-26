let map = L.map("map").setView([37.7577, -122.4376], 13);

L.tileLayer("http://a.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmVnb21pIiwiYSI6IkRNSkNoRWMifQ.cydNn3XrNI48_36-Wwz2kw", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18
}).addTo(map);

class Map {

}

// function initialize() {
//     var mapOptions = {
//         zoom: 13,
//         center: new google.maps.LatLng(37.7577, -122.4376),
//         disableDefaultUI: true,
//         styles: MAP_STYLES
//     };
//
//     // Create the map
//     var map = new google.maps.Map(d3.select('#map').node(), mapOptions);
//
//     // Make map object available
//     return getMap = function() {
//         return map;
//     };
// }
//
// // Draw markers on map
// function loadMarkers() {
//     d3.json('data/sfbikeparking.json', function(error, data) {
//         if (error) { console.error(error); }
//
//         var overlay = new google.maps.OverlayView();
//
//         overlay.onAdd = function() {
//             var layer = d3.select(this.getPanes().overlayMouseTarget)
//                 .append('div');
//
//             overlay.draw = function() {
//                 var projection = this.getProjection();
//
//                 // Set marker position
//                 function setPosition(d) {
//                     var lat = d.value.latitude.latitude;
//                     var lng = d.value.latitude.longitude;
//
//                     d = new google.maps.LatLng(lat, lng);
//                     d = projection.fromLatLngToDivPixel(d);
//
//                     return d3.select(this)
//                         .style('left', (d.x - 10) + 'px')
//                         .style('top', (d.y - 10) + 'px');
//                 }
//
//                 // Compress range while keeping ratio
//                 var spaces = data.map(function(e){return parseInt(e.spaces, 10);});
//                 var maxCircleRadius = 35;
//                 var minCircleRadius = 6;
//                 var oldMax = d3.max(spaces);
//                 var oldMin = d3.min(spaces);
//                 var oldRange = (oldMax - oldMin);
//                 var newRange = (maxCircleRadius - minCircleRadius);
//
//                 // Calculate new radius value based on num spaces
//                 function radiusValue(d) {
//                     return (((d.value.spaces - oldMin) * newRange) / oldRange) + minCircleRadius;
//                 }
//
//                 // Set position and size of marker elements
//                 var marker = layer.selectAll('svg')
//                     .data(d3.entries(data)) // turn obj literal into k/v pairs
//                     .each(setPosition) // update existing markers
//                     .enter()
//                         .append('svg:svg')
//                         .each(setPosition);
//                         // .attr('width', '3px')
//                         // .attr('height', '3px');
//
//                 // Create SVG circles
//                 marker.append('svg:circle')
//                     .attr('r', 5)
//                     .attr('cx', 5)
//                     .attr('cy', 5)
//                     .style('opacity', '0.5')
//                     .style('fill', 'red')
//                     .on('mouseover', function() {
//                     });
//
//             };
//         };
//         // Bind overlay to the map
//         var map = getMap();
//         overlay.setMap(map);
//     });
// }
//
// google.maps.event.addDomListener(window, 'load', function() {
//     initialize();
//     loadMarkers();
// });
