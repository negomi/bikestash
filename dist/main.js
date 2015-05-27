"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

(function ($, L) {
    "use strict";

    // Map constructor.

    var Map = function Map(opts) {
        _classCallCheck(this, Map);

        this.opts = opts;
        this.init();
    };

    // Inititalizes the map object and adds the tiles.
    Map.prototype.init = function () {
        this.view = L.map(this.opts.id).setView(this.opts.coords, this.opts.zoom);

        L.tileLayer("" + this.opts.tiles + "?access_token=" + this.opts.token, {
            attribution: this.opts.attribution,
            maxZoom: this.opts.maxZoom
        }).addTo(this.view);

        this.fetchData();
    };

    // Fetches the data and then calls the addMarkers function.
    Map.prototype.fetchData = function () {
        var _this = this;

        $.getJSON("/data/sfbikeparking.json", function (data) {
            _this.data = data;
            _this.addMarkers();
        });
    };

    // Adds markers to the map, handling styling for the icons and polygons.
    // Clusters groups of markers using Leaflet.markercluster.
    // Sets click handler for individual markers.
    Map.prototype.addMarkers = function () {
        var _this = this;

        var markers = [];
        var iconStyles = { icon: "bicycle", prefix: "fa", markerColor: "black" };
        var polygonStyles = { color: "#303030", opacity: 0.9 };

        this.markers = new L.MarkerClusterGroup({ polygonOptions: polygonStyles });

        this.data.forEach(function (item) {
            var marker = L.marker([item.latitude.latitude, item.latitude.longitude], { icon: L.AwesomeMarkers.icon(iconStyles) }).bindPopup(_this.formatPopupContent(item));

            markers.push(marker);
        });

        this.markers.addLayers(markers).addTo(this.view);
        this.markers.on("click", function () {
            this.openPopup();
        });
    };

    // Builds the HTML to populate a marker's popup tooltip.
    Map.prototype.formatPopupContent = function (item) {
        // Eliminates weird data values.
        var name = item.addr_num !== "UK" ? "<div class=\"name\">" + item.addr_num + "</div>" : "";
        var address = item.yr_inst !== "None" ? "<div class=\"address\">" + item.yr_inst + "</div>" : "";

        return "" + name + " " + address + "\n            <hr class=\"divider\">\n            <div>Racks: <span class=\"number\">" + item.racks + "</span></div>\n            <div>Spaces: <span class=\"number\">" + item.spaces + "</span></div>";
    };

    // Sets the options to initialize the map.
    var opts = {
        id: "map",
        coords: [37.7577, -122.4376],
        zoom: 13,
        maxZoom: 18,
        tiles: "http://{s}.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png",
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        token: "pk.eyJ1IjoibmVnb21pIiwiYSI6IkRNSkNoRWMifQ.cydNn3XrNI48_36-Wwz2kw"
    };

    // Creates a map instance.
    var sf = new Map(opts);
})(jQuery, L);