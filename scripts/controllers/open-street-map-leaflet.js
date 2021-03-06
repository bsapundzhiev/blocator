
function OpenStreetMap(options) { // extends Map
    Map.call(this, options);

    /* Initialize superclass attributes */
    this.searchInput = document.querySelector('#nominatimSearch input');
    this.searchButton = document.querySelector('#nominatimSearch button');

    this.markers = null;
    this.track = null;
    this.locators = {};
    this.locatorIcon = null;
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

        /* Initialize superclass attributes */
        var osmPosition = L.latLng(this.defaultPosition.coords.latitude, this.defaultPosition.coords.longitude);

        this.map = L.map(this.mapId, {
            center: osmPosition,
            zoom: this.defaultZoom,
            maxZoom: this.maxZoom
        });


        if(!this.mapTiles) {
            this.mapTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }

        L.tileLayer(this.mapTiles, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo( this.map );


        /* Clear search input value */
        this.locatorIcon = L.icon({
            iconUrl: 'libs/OpenLayers/img/marker.png',
            //iconSize: [38, 95],
            iconAnchor: [0,5, 1],
            popupAnchor: [8, 0]
        });

        //this.searchInput.value = '';
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
     * showPosition
     * Show the specified position on the map
     * @param {Position} position
     */
    showPosition: function(position) {

        /* Retrieve longitude and latitude from Position */
        var plon = position.coords.longitude;
        var plat = position.coords.latitude;
        var osmPosition = L.latLng(plat, plon);

        //this.map.panTo()

        if (this.currentPosition === null) { // if this is the first time this method is invoked

            /* Add a marker to the center */
            var marker = L.marker(osmPosition).addTo(this.map);
            /* Show POIs only the first time this method is called */
            //this.showPOIs(new OpenLayers.LonLat(plon, plat));

            /* Keep track of the current position */
            this.currentPosition = osmPosition;

            this.markers.push(marker);
        } else {
            this.markers[0].setLatLng(osmPosition);
            this.markers[0].update();
        }
    },
    /*
     * showPosition
     * Show the specified position on the map
     * @param {Position} position
     */
    showLocatorPosition: function(name, position) {

        var plon = position.coords.longitude;
        var plat = position.coords.latitude;
        var osmPosition = L.latLng(plat, plon);

        if(!this.locators[name]) {
            var marker = L.marker(osmPosition).addTo(this.map);
            var text = "<b>"+ name +"</b>";
            if(position.provider) {
                text += "<br/><b>Prov:"+ position.provider +"</b>";
            }
            if(position.accuracy) {
                text += "<b>,Acc:"+ position.accuracy.toFixed(0) +"</b>";
            }
            if(position.bearing) {
                text += "<b>,H:"+ JSUtil.bearingWordTo(position.bearing) +"</b>";
            }
            if(position.time) {
                text += "<br/><b>T:"+ new Date(position.time).toLocaleTimeString() +"</b>";
            }

            marker.bindPopup(text).openPopup();

            var trackLine = new L.Polyline([], {
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            }).addTo(this.map);

            this.locators[name] = {
                marker: marker,
                trackLine: trackLine,
            };
        }

        this.locators[name].marker.setLatLng(osmPosition);
        this.locators[name].marker.update();

        if (this.locators[name].trackLine.getLatLngs().length > 60) {
            this.locators[name].trackLine.spliceLatLngs(0, 1);
        }
        this.locators[name].trackLine.addLatLng(osmPosition)
        this.locators[name].trackLine.redraw();

        this.map.panTo(osmPosition);
    },
    /*
     * Load gpx track
     */
    loadGeoJSON: function(geojsonFeature) {
        if(this.track) {
            this.map.removeLayer(this.track);
        }
        var lineStyle = {
            "color": "#ff0000",
            "weight": 5,
            "opacity": 0.65
        };
        this.track = new L.geoJson(geojsonFeature, {
            style:lineStyle
        });
        this.map.addLayer(this.track);
        this.map.panTo(geojsonFeature.coordinates[0].reverse());
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

        var plon = position.lon;
        var plat = position.lat;

        /* Show random positioned markers */
        var self = this;
        for (var i = 0; i < 10; i++) {
            var lon = plon - 0 + (Math.random() * 0.01) - 0.005;
            var lat = plat - 0 + (Math.random() * 0.01) - 0.005;

            var osmPosition = L.latLng(lat, lon);
            var marker = L.marker(osmPosition).addTo(this.map);
            marker.bindPopup("<b>POI "+ i +"</b>").openPopup();
        }
    }
};
