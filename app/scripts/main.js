// Data source URL (load from server eventually?)
var bikeRacks = 'http://data.sfgov.org/resource/w969-5mn4.json?' +
    'status_detail=INSTALLED' +
    '&$offset=1000' +
    '&$where=spaces>0 AND spaces<30';

// $.get('sfbikeparking.json', function(data){console.log(data);});

function initialize() {
    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(37.7577, -122.4376),
        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        }
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

                // Find max or min element in array
                function getFromArray(numArray, condition) {
                    if (condition === 'max') {
                        return Math.max.apply(null, numArray);
                    } else if (condition === 'min') {
                        return Math.min.apply(null, numArray);
                    }
                }

                // Compress range while keeping ratio
                var spaces = data.map(function(e){return e.spaces;});
                var maxCircleRadius = 35;
                var minCircleRadius = 6;
                var oldMax = getFromArray(spaces, 'max');
                var oldMin = getFromArray(spaces, 'min');
                var oldRange = (oldMax - oldMin);
                var newRange = (maxCircleRadius - minCircleRadius);

                // Calculate new radius value based on num spaces
                function radiusValue(d) {
                    return (((d.value.spaces - oldMin) * newRange) / oldRange) + minCircleRadius;
                }

                // Get random color
                function randomColor() {
                    return 'hsl(' + Math.random() * 360 + ', 70%, 40%)';
                };

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
                    // .on('mouseout', function() {
                    //     d3.select(this)
                    //         .transition()
                    //         .delay(1000)
                    //         .duration(1000)
                    //         .style('fill', '#e35026');
                    // });

                // Add a label.
                // marker.append('svg:text')
                //     .attr('x', 25 + 7)
                //     .attr('y', 25)
                //     .attr('dy', '.31em')
                //     .text(function(d) {return d.key;});

            };
        };
        // Bind overlay to the map
        var map = getMap();
        overlay.setMap(map);
    });
}

google.maps.event.addDomListener(window, 'load', function(){
    initialize();
    loadMarkers(bikeRacks);
});
