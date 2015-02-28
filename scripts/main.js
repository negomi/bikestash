(function($, L) {
    'use strict';

    class Map {
        constructor(opts) {
            this.opts = opts;
            this.init();
        }
    }

    Map.prototype.init = function() {
        this.view = L.map(this.opts.id).setView(this.opts.coords, this.opts.zoom);

        L.tileLayer(`${this.opts.tiles}?access_token=${this.opts.token}`, {
            attribution: this.opts.attribution,
            maxZoom: this.opts.maxZoom
        }).addTo(this.view);

        this.fetchData();
    };

    Map.prototype.fetchData = function() {
        $.getJSON('/data/sfbikeparking.json', (data) => {
            this.data = data;
            this.addMarkers();
        });
    };

    Map.prototype.addMarkers = function() {
        this.markers = new L.MarkerClusterGroup();
        let markers = [];

        this.data.forEach((item) => {
            let marker = L.marker(
                [item.latitude.latitude, item.latitude.longitude]
            ).bindPopup(this.formatPopupContent(item));

            markers.push(marker);
        });

        this.markers.addLayers(markers).addTo(this.view);
        this.markers.on('click', function() { this.openPopup() });
    };

    Map.prototype.formatPopupContent = function(item) {
        // Eliminate weird data values.
        let name = item.addr_num !== 'UK' ? `<h3>${item.addr_num}</h3>` : '';
        let address = item.yr_inst !== 'None' ? `<h4>${item.yr_inst}</h4>` : '';

        return `${name} ${address}
        <div><b>Racks:</b> ${item.racks}</div>
        <div><b>Spaces:</b> ${item.spaces}</div>`;
    }

    let opts = {
        id: 'map',
        coords: [37.7577, -122.4376],
        zoom: 13,
        maxZoom: 18,
        tiles: 'http://{s}.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png',
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        token: 'pk.eyJ1IjoibmVnb21pIiwiYSI6IkRNSkNoRWMifQ.cydNn3XrNI48_36-Wwz2kw'
    };

    let sf = new Map(opts);
})(jQuery, L);
