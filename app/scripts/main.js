function initialize() {
    // Create the map
    var map = new google.maps.Map(d3.select('#map').node(), {
        zoom: 13,
        center: new google.maps.LatLng(37.7577, -122.4376),
        // mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    // Make map object available
    return getMap = function() {
        return map;
    };
}

google.maps.event.addDomListener(window, 'load', initialize);

d3.json(
    'http://data.sfgov.org/resource/w969-5mn4.json',
    function(data) {

        var overlay = new google.maps.OverlayView();

        overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayMouseTarget)
                .append('div')
                .attr('class', 'racks');

            overlay.draw = function() {
                var projection = this.getProjection();

                var marker = layer.selectAll('svg')
                    .data(d3.entries(data)) // turn obj literal into k/v pairs
                    .each(transform) // update existing markers
                    .enter()
                        .append('svg:svg')
                        .each(transform)
                        .attr('class', 'marker');

                // Add a circle
                marker.append('svg:circle')
                    .attr('r', 5)
                    .attr('cx', 5)
                    .attr('cy', 5)
                    .style('opacity', '0.8')
                    .style('fill', function() {
                        return 'hsl(' + Math.random() * 360 + ', 80%, 30%)';
                    })
                    .on('mouseover', function() {
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('r', 25)
                            .attr('cx', 25)
                            .attr('cy', 25);

                        d3.select(this.parentNode)
                            .style('width', '50px')
                            .style('height', '50px');

                    })
                    .on('mouseout', function() {
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr('r', 5)
                            .attr('cx', 5)
                            .attr('cy', 5);

                        d3.select(this.parentNode)
                            .style('width', '10px')
                            .style('height', '10px');
                    });

                // Add a label.
                // marker.append('svg:text')
                //     .attr('x', 25 + 7)
                //     .attr('y', 25)
                //     .attr('dy', '.31em')
                //     .text(function(d) {return d.key;});

                function transform(d) {
                    var lat = d.value.coordinates.latitude;
                    var lng = d.value.coordinates.longitude;

                    d = new google.maps.LatLng(lat, lng);
                    d = projection.fromLatLngToDivPixel(d);

                    return d3.select(this)
                        .style('left', (d.x - 25) + 'px')
                        .style('top', (d.y - 25) + 'px');
                }
            };
        };

        // Bind overlay to the map
        var map = getMap();
        overlay.setMap(map);
    }
);

// $('svg').on("click", function( event ) {
//     event.stopPropagation();
//     console.log(event.target);
//     console.log(this);
// });
