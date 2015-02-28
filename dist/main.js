"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

(function ($, L) {
    "use strict";

    var Map = function Map(opts) {
        _classCallCheck(this, Map);

        this.opts = opts;
        this.init();
    };

    Map.prototype.init = function () {
        this.view = L.map(this.opts.id).setView(this.opts.coords, this.opts.zoom);

        L.tileLayer("" + this.opts.tiles + "?access_token=" + this.opts.token, {
            attribution: this.opts.attribution,
            maxZoom: this.opts.maxZoom
        }).addTo(this.view);

        this.fetchData();
    };

    Map.prototype.fetchData = function () {
        var _this = this;

        $.getJSON("/data/sfbikeparking.json", function (data) {
            _this.data = data;
            _this.addMarkers();
        });
    };

    Map.prototype.addMarkers = function () {
        var _this = this;

        this.markers = new L.MarkerClusterGroup();
        var markers = [];

        this.data.forEach(function (item) {
            var marker = L.marker([item.latitude.latitude, item.latitude.longitude]).bindPopup(_this.formatPopupContent(item));

            markers.push(marker);
        });

        this.markers.addLayers(markers).addTo(this.view);
        this.markers.on("click", function () {
            this.openPopup();
        });
    };

    Map.prototype.formatPopupContent = function (item) {
        // Eliminate weird data values.
        var name = item.addr_num !== "UK" ? "<h3>" + item.addr_num + "</h3>" : "";
        var address = item.yr_inst !== "None" ? "<h4>" + item.yr_inst + "</h4>" : "";

        return "" + name + " " + address + "\n        <div><b>Racks:</b> " + item.racks + "</div>\n        <div><b>Spaces:</b> " + item.spaces + "</div>";
    };

    var opts = {
        id: "map",
        coords: [37.7577, -122.4376],
        zoom: 13,
        maxZoom: 18,
        tiles: "http://{s}.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png",
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        token: "pk.eyJ1IjoibmVnb21pIiwiYSI6IkRNSkNoRWMifQ.cydNn3XrNI48_36-Wwz2kw"
    };

    var sf = new Map(opts);
})(jQuery, L);