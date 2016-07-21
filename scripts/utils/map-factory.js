
var MapFactory = {
    /*
     * create
     * Factory method that creates a new Map
     * @param {Object} options
     * @return {Map} object
     */
    create: function(options) {
        var mapClass = OpenStreetMap;

        if (options.mapType === 'openstreetmap') {
            mapClass = OpenStreetMap;
        }
        else if (options.mapType === 'googlemap') {
            mapClass = GoogleMap;
        }
        else if (options.mapType === 'hybridmap') {
            mapClass = HybridMap;
        }

        return new mapClass(options);
    }
};
