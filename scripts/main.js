(function(L) {

  'use strict';

  class Map {
    constructor(opts) {
      this.opts = opts;
      this.init();
    }

    // Inititalizes the map object and adds the tiles.
    init() {
      this.view = L.map(this.opts.id).setView(this.opts.coords, this.opts.zoom);

      L.tileLayer(`${this.opts.tiles}?access_token=${this.opts.token}`, {
        attribution: this.opts.attribution,
        maxZoom: this.opts.maxZoom
      }).addTo(this.view);

      this.fetchData();
    };

    // Fetches the data and then calls the addMarkers function.
    fetchData() {
      var request = new XMLHttpRequest();
      request.open('GET', location.pathname + 'data/sfbikeparking.json', true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          this.data = JSON.parse(request.responseText);
          this.addMarkers();
        } else {
          console.error(request.responseText);
        }
      };

      request.onerror = () => {
        console.error('Failed to fetch the data');
      };

      request.send();
    };

    // Adds markers to the map, handling styling for the icons and polygons.
    // Clusters groups of markers using Leaflet.markercluster.
    // Sets click handler for individual markers.
    addMarkers() {
      let markers = [];
      let iconStyles = { icon: 'bicycle', prefix: 'fa', markerColor: 'black' };
      let polygonStyles = { color: '#303030', opacity: 0.9 };

      this.markers = new L.MarkerClusterGroup({polygonOptions: polygonStyles});

      this.data.forEach((item) => {
        let marker = L.marker(
          [item.latitude.latitude, item.latitude.longitude],
          {icon: L.AwesomeMarkers.icon(iconStyles)}
        ).bindPopup(this.formatPopupContent(item));

        markers.push(marker);
      });

      this.markers.addLayers(markers).addTo(this.view);
      this.markers.on('click', function() { this.openPopup() });
    };

    // Builds the HTML to populate a marker's popup tooltip.
    formatPopupContent(item) {
      // Eliminates weird data values.
      let name = item.addr_num !== 'UK' ? `<div class="name">${item.addr_num}</div>` : '';
      let address = item.yr_inst !== 'None' ? `<div class="address">${item.yr_inst}</div>` : '';

      return `${name} ${address}
        <hr class="divider">
        <div>Racks: <span class="number">${item.racks}</span></div>
        <div>Spaces: <span class="number">${item.spaces}</span></div>`;
    }
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

})(L);
