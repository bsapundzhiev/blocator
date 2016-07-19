
function OpenStreetMap(options) { // extends Map
    Map.call(this, options);

    /* Initialize superclass attributes */
    this.searchInput = document.querySelector('#nominatimSearch input');
    this.searchButton = document.querySelector('#nominatimSearch button');

    /* OpenStreetMap attributes */
    this.mapnik = null;
    this.fromProjection = null;
    this.toProjection = null;
    this.markers = [];
    this.locators = {};
}

/* OpenStreetMap extends Map */
//JSUtil.extend(OpenStreetMap, Map);
OpenStreetMap.prototype = Object.create(Map.prototype);
OpenStreetMap.prototype.constructor = OpenStreetMap;

OpenStreetMap.prototype = {
    /*
     * initMap
     * Initializes and shows the map
     */
    initMap: function() {
        Map.prototype.initMap.call(this);

        this.fromProjection = 'EPSG:4326';
        this.toProjection = 'EPSG:900913';

        /* Clear search input value */
        this.searchInput.value = '';

        var trackStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'rgba(0,0,255,1.0)',
              width: 3,
              lineCap: 'round'
            })
        });

        // use a single feature with a linestring geometry to display our track
        var trackFeature = new ol.Feature({
            geometry: new ol.geom.LineString([])
        });

        this.map = new ol.Map({
            target:this.mapId,
            renderer:'canvas',
            view: new ol.View({
                projection: 'EPSG:900913',
            })
        });

        this.mapnik = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

        this.map.addLayer(this.mapnik);

        var osmPosition = new ol.proj.transform([this.defaultPosition.coords.longitude, this.defaultPosition.coords.latitude],
                                this.fromProjection, // essentially LonLat
                                this.map.getView().getProjection());

        this.map.getView().setCenter(osmPosition);
        this.map.getView().setZoom(this.defaultZoom);
    },
    /*
     * initSearchBox
     * Initialize Nominatim Search Box
     */
    initSearchBox: function() {
        Map.prototype.initSearchBox.call(this);

        var self = this;

        /* Initialize event handlers */
        this.searchButton.onclick = function() {
            SearchBox.search(self.searchInput.value, 'libs/OpenLayers/img/marker.png', true);
            return false;
        };
    },
    /*
     * create marker
     */
    createMarker: function(name) {

        var iconGeometry = new ol.geom.Point([0, 0]);
        var iconFeature = new ol.Feature({
            geometry: iconGeometry //new ol.geom.Point(osmPosition)
        });

        var vectorSource = new ol.source.Vector({
            features: [iconFeature]
        });

        var iconStyle = [
            new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: 'libs/OpenLayers/img/marker.png',
                }))
            }),
            new ol.style.Style({
                text: new ol.style.Text({
                    text: name || "Point Label",
                    offsetY: 8,
                    fill: new ol.style.Fill({
                        color: '#000'
                    })
                })
            })
        ];

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style:iconStyle
        });
        this.map.addLayer(vectorLayer);
        return iconGeometry;
    },
    /*
     * showPosition
     * Show the specified position on the map
     * @param {Position} position
     */
    showPosition: function(position) {

        /* Retrieve longitude and latitude from Position */
        var plon = position.coords.longitude;
        var plat = position.coords.latitude;

        /* Calculate the OpenStreetMap position */
        var osmPosition = new ol.proj.transform([plon, plat],
                                this.fromProjection, // essentially LonLat
                                this.map.getView().getProjection());

        /* Set the center of the map */
        this.map.getView().setZoom(this.defaultZoom);
        this.map.getView().setCenter(osmPosition);

        if (this.currentPosition === null) { // if this is the first time this method is invoked

            /* Keep track of the current position */
            this.currentPosition = osmPosition;

            this.markers.push(this.createMarker("Default"));
        }

        this.markers[0].setCoordinates(osmPosition);

    },
    /*
     * showPosition
     * Show the specified position on the map
     * @param {Position} position
     */
    showLocatorPosition: function(name, position) {

        var osmPosition = new ol.proj.transform([position.coords.longitude, position.coords.latitude],
                                this.fromProjection, // essentially LonLat
                                this.map.getView().getProjection());

        /* Set the center of the map */
        this.map.getView().setZoom(this.defaultZoom);
        this.map.getView().setCenter(osmPosition);

        if(!this.locators[name]) {
            this.locators[name] = this.createMarker(name);
        }

        this.locators[name].setCoordinates(osmPosition);
    },
    /*
     * handleGeolocationErrors
     * Handles geolocation errors
     * @param {PositionError} position
     */
    handleGeolocationErrors: function(positionError) {
        Map.prototype.handleGeolocationErrors.call(this, positionError);
    },
    /*
     * search
     * Perform the search based on the specified query
     * @param {String || mozContact} query
     */
    search: function(query) {
        Map.prototype.search.call(this, query);

        /* Quit search if no query */
        if (query === undefined || query === '') {
            return;
        }

        /* If query is a mozContact */
        var contact = null;
        if (ContactManager.isContact(query)) {
            /* Save the contact and build a query search string */
            contact = query;
            query = ContactManager.contactAddressToString(contact);
        }

        /* Prepare AJAX communication with nominatim */
        var xhr = new XMLHttpRequest();
        var method = 'GET';
        var url = 'http://nominatim.openstreetmap.org/?q=' + query + '&format=json';
        var self = this;

        /* Send request */
        xhr.open(method, url, true);
        xhr.send();

        /* Handle answer */
        xhr.onreadystatechange = function() {

            /* If success */
            if (this.readyState === 4 && this.status === 200) {

                /* Parse the JSON response */
                var response = JSON.parse(this.responseText);
                console.log(response[0]);

                /* Take the first result and get geo infos */
                var rlon = parseFloat(response[0].lon);
                var rlat = parseFloat(response[0].lat);
                var position = new OpenLayers.LonLat(rlon, rlat).transform(self.fromProjection, self.toProjection);

                var markerDescription = response[0].display_name;
                if (contact) {
                    markerDescription = contact.name[0] + '<br/>' + ContactManager.contactAddressToString(contact);
                }
                else {
                    /* Print place found */
                    self.searchInput.value = markerDescription;
                }

                var markerImage = 'libs/OpenLayers/img/marker.png';
                if (contact && contact.photo && contact.photo.length > 0) {
                    markerImage = window.URL.createObjectURL(contact.photo[0]);
                }

                var markerIcon = new OpenLayers.Icon(markerImage);
                var marker = new OpenLayers.Marker(position, markerIcon);

                /* Set the center of the map */
                self.map.setCenter(position);

                /* Add a marker on the place found */
                self.markers.addMarker(marker);

                /* Adapt map zoom */
                var newBound = self.markers.getDataExtent();
                self.map.zoomToExtent(newBound);

                /* Add a popup window */
                marker.popup = new OpenLayers.Popup.FramedCloud("osmpopup",
                        position,
                        new OpenLayers.Size(200, 200),
                        markerDescription,
                        null,
                        true);

                marker.events.register("click", marker, function(e) {
                    self.map.addPopup(this.popup);
                });

                if (contact === null) {
                    /* Display points of interest around the position */
                    self.showPOIs(new OpenLayers.LonLat(rlon, rlat));
                }

            }
        };

        console.log(xhr);
    },
    /*
     * showPOIs
     * Show the Points Of Interest around the specified position
     * @param {OpenLayers.LonLat} position
     */
    showPOIs: function(position) {
        Map.prototype.showPOIs.call(this, position);

        /* Retrieve longitude and latitude from OpenLayers.LonLat */
        var plon = position.lon;
        var plat = position.lat;

        /* Show random positioned markers */
        var self = this;
        for (var i = 0; i < 10; i++) {
            var lon = plon - 0 + (Math.random() * 0.01) - 0.005;
            var lat = plat - 0 + (Math.random() * 0.01) - 0.005;
            var mposition = new OpenLayers.LonLat(lon, lat).transform(self.fromProjection, self.toProjection);
            var markerIcon = new OpenLayers.Icon('libs/OpenLayers/img/marker-green.png');
            var marker = new OpenLayers.Marker(mposition, markerIcon);

            marker.popup = new OpenLayers.Popup.FramedCloud("osmpopup",
                    mposition,
                    new OpenLayers.Size(200, 200),
                    "point of interest " + i,
                    null,
                    true);

            marker.events.register("click", marker, function(e) {

                self.map.addPopup(this.popup);
            });

            self.markers.addMarker(marker);
        }

    }
};
