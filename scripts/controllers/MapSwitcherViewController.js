
function MapSwitcherViewController() {
    console.log('MapSwitcherViewController()');
    
    /* Map containers's DOM objects */
    this.openstreetmapViewControllerBox = document.querySelector('#openstreetmap');
    this.googlemapViewControllerBox = document.querySelector('#googlemap');
    this.hybridmapViewControllerBox = document.querySelector('#hybridmap');

    /* Attributes to keep track of initialized MapViewControllers */
    this.openstreetmapViewController = null;
    this.googlemapViewController = null;
    this.hybridmapViewController = null;

    var self = this;

    /* Manage target elements */
    window.onhashchange = function() {

        self.performSwitch(window.location.hash);
    };

    this.performSwitch(window.location.hash);

}

MapSwitcherViewController.prototype = {
    /*
     * performSwitch
     * Switch to the requested map
     * @param {String} action
     */
    performSwitch: function(action) {
        console.log('MapSwitcherViewController.performSwitch(action)');
        console.log(action);

        if (action === '#showOpenStreetMap') {
            this.switchToOpenStreetMap();
        }
        else if (action === '#showGoogleMap') {
            this.switchToGoogleMap();
        }
        else if (action === '#showHybridMap') {
            this.switchToHybridMap();
        }
        else {
            window.location.hash = 'showOpenStreetMap';
        }
    },
    /*
     * switchToOpenStreetMap
     * Switch to OpenStreetMap
     */
    switchToOpenStreetMap: function() {
        console.log('MapSwitcherViewController.switchToOpenStreetMap()');

        /* Show map container */
        this.googlemapViewControllerBox.style.display = 'none';
        this.hybridmapViewControllerBox.style.display = 'none';
        this.openstreetmapViewControllerBox.style.display = 'block';

        /* Show the nominatim search bar */
        window.mSearchBoxViewController.showNominatimSearch();

        /* Create a new MapViewController if it doesn't exist already */
        if (this.openstreetmapViewController === null) {
            this.openstreetmapViewController = MapViewControllerFactory.create({
                mapType: 'openstreetmap',
                mapId: 'openstreetmap'
            });

            /* Save the MapViewController on window */
            window.mMapViewController = this.openstreetmapViewController;

            /* Initializes the map and the search box */
            window.mMapViewController.initMap();
            window.mMapViewController.initSearchBox();
        }
        else {
            /* Save the MapViewController on window */
            window.mMapViewController = this.openstreetmapViewController;
        }

    },
    /*
     * switchToGoogleMap
     * Switch to Google Maps
     */
    switchToGoogleMap: function() {
        console.log('MapSwitcherViewController.switchToGoogleMap()');

        /* Show map container */
        this.openstreetmapViewControllerBox.style.display = 'none';
        this.hybridmapViewControllerBox.style.display = 'none';
        this.googlemapViewControllerBox.style.display = 'block';

        /* Show the google search bar */
        window.mSearchBoxViewController.showGoogleSearch();

        /* Create a new MapViewController if it doesn't exist already */
        if (this.googlemapViewController === null) {
            this.googlemapViewController = MapViewControllerFactory.create({
                mapType: 'googlemap',
                mapId: 'googlemap'
            });

            /* Save the MapViewController on window */
            window.mMapViewController = this.googlemapViewController;

            /* Initializes the map and the search box */
            window.mMapViewController.initMap();
            window.mMapViewController.initSearchBox();
        }
        else {
            /* Save the MapViewController on window */
            window.mMapViewController = this.googlemapViewController;
        }

    },
    /*
     * switchToHybridMap
     * Switch to Hybrid Map
     */
    switchToHybridMap: function() {
        console.log('MapSwitcherViewController.switchToHybridMap()');

        /* Show map container */
        this.openstreetmapViewControllerBox.style.display = 'none';
        this.googlemapViewControllerBox.style.display = 'none';
        this.hybridmapViewControllerBox.style.display = 'block';

        /* Show the google search bar */
        window.mSearchBoxViewController.showHybridSearch();

        /* Create a new MapViewController if it doesn't exist already */
        if (this.hybridmapViewController === null) {
            this.hybridmapViewController = MapViewControllerFactory.create({
                mapType: 'hybridmap',
                mapId: 'hybridmap'
            });

            /* Save the MapViewController on window */
            window.mMapViewController = this.hybridmapViewController;

            /* Initializes the map and the search box */
            window.mMapViewController.initMap();
            window.mMapViewController.initSearchBox();
        }
        else {
            /* Save the MapViewController on window */
            window.mMapViewController = this.hybridmapViewController;
        }

    }
};
