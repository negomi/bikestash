// Get data from SF Open Data Portal
// Will only return 1000 results per request
var datasetOne = 'http://data.sfgov.org/resource/w969-5mn4.json?' +
    'status_detail=INSTALLED' +
    '&$where=spaces>0 AND spaces<30';

var datasetTwo = 'http://data.sfgov.org/resource/w969-5mn4.json?' +
    'status_detail=INSTALLED' +
    '&$offset=1000' +
    '&$where=spaces>0 AND spaces<30';

var datasetThree = 'http://data.sfgov.org/resource/w969-5mn4.json?' +
    'status_detail=INSTALLED' +
    '&$offset=2000' +
    '&$where=spaces>0 AND spaces<30';

function initialize() {
    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(37.7577, -122.4376),
        disableDefaultUI: true,
        styles: [{
            'stylers': [
                { 'saturation': -100 },
                { 'gamma': 0.5 }
            ]
        }]
    };

    // Create the map
    var map = new google.maps.Map(d3.select('#map').node(), mapOptions);

    // Make map object available
    return getMap = function() {
        return map;
    };
}

// Draw markers on map
function loadMarkers(dataSet) {
    d3.json(dataSet, function(error, data) {
        if (error) { console.warn(error); }

        var overlay = new google.maps.OverlayView();

        overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayMouseTarget)
                .append('div');

            overlay.draw = function() {
                var projection = this.getProjection();

                // Set marker position
                function setPosition(d) {
                    var lat = d.value.coordinates.latitude;
                    var lng = d.value.coordinates.longitude;

                    d = new google.maps.LatLng(lat, lng);
                    d = projection.fromLatLngToDivPixel(d);

                    return d3.select(this)
                        .style('left', (d.x - 10) + 'px')
                        .style('top', (d.y - 10) + 'px');
                }

                // Compress range while keeping ratio
                var spaces = data.map(function(e){return parseInt(e.spaces, 10);});
                var maxCircleRadius = 35;
                var minCircleRadius = 6;
                var oldMax = d3.max(spaces);
                var oldMin = d3.min(spaces);
                var oldRange = (oldMax - oldMin);
                var newRange = (maxCircleRadius - minCircleRadius);

                // Calculate new radius value based on num spaces
                function radiusValue(d) {
                    return (((d.value.spaces - oldMin) * newRange) / oldRange) + minCircleRadius;
                }

                // Get random color
                function randomColor() {
                    return 'hsl(' + Math.random() * 360 + ', 70%, 30%)';
                }

                // Make heading random color
                d3.select('.heading')
                    .style('color', randomColor)
                    .style('opacity', 0.5);

                // Set position and size of marker elements
                var marker = layer.selectAll('svg')
                    .data(d3.entries(data)) // turn obj literal into k/v pairs
                    .each(setPosition) // update existing markers
                    .enter()
                        .append('svg:svg')
                        .each(setPosition)
                        .attr('width', function(d) {return radiusValue(d)*2+'px';})
                        .attr('height', function(d) {return radiusValue(d)*2+'px';});

                // Create SVG circles
                marker.append('svg:circle')
                    .attr('r', function(d) {return radiusValue(d);})
                    .attr('cx', function(d) {return radiusValue(d);})
                    .attr('cy', function(d) {return radiusValue(d);})
                    .style('opacity', '0.5')
                    .style('fill', randomColor)
                    .on('mouseover', function() {
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .style('fill', randomColor);
                    });

            };
        };

        // Bind overlay to the map
        var map = getMap();
        overlay.setMap(map);
    });
}

google.maps.event.addDomListener(window, 'load', function() {
    initialize();
    loadMarkers(datasetOne);
    loadMarkers(datasetTwo);
    loadMarkers(datasetThree);
});
