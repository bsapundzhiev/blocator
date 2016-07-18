var GeoMap;

function Map(options) {
    console.log('Map(options)');
    console.log(options);

    /* Attributes */
    this.mapId = options.mapId;
    this.map = null;
    this.searchInput = null;
    this.searchButton = null;
    this.currentPosition = null;
    this.defaultZoom = 13; //15;
    this.defaultPosition = {
	
        coords: {
            longitude: 25.6462243,
            latitude: 43.0907923
        }
    };
}

Map.prototype = {
    /*
     * initMap
     * Initializes and show the map
     */
    initMap: function() {
        console.log('Map.initMap()');
    },
    /*
     * initSearchBox
     * Initialize Search Box
     */
    initSearchBox: function() {
        console.log('Map.initSearchBox()');
    },
    /*
     * showPosition
     * Show the specified position on the map
     * @param {Position|OpenLayers.LonLat} position
     */
    showPosition: function(position) {
        console.log('Map.showPosition(position)');
        console.log(position);
    },
    /*
     * handleGeolocationErrors
     * Handles geolocation errors
     * @param {Position} position
     */
    handleGeolocationErrors: function(positionError) {
        console.log('Map.handleGeolocationErrors(positionError)');
        console.log(positionError);

        if (positionError) {

            /* Show the error message */
            alert(positionError.message);

        }
        else {

            /* Show a error message */
            alert("Geolocation API not supported");

        }
    },
    /*
     * search
     * Perform the search based on the specified query
     * @param {String || mozContact} query
     */
    search: function(query) {
        console.log('Map.search(query)');
        console.log(query);
        
        /* Perform the search if a query is specified */
        if (query === undefined || query === '') {
            alert("Please insert a address");
        }
    },
    /*
     * showPOIs
     * Show the Points Of Interest around the specified position
     * @param {Position|OpenLayers.LonLat} position
     */
    showPOIs: function(position) {
        console.log('Map.showPOIs(position)');
        console.log(position);
    },

    /*
     * show tracked position
     */
    showLocatorPosition: function(name, position) {
        console.log('Map.showLocatorPosition');
        console.log(name, position);
    }
};
