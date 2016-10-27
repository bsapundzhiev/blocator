
var App = {
    /*
     * init
     * Initialize the app
     */
    init: function() {

        /* Initialize Javascript objects */
        ContactManager.init();
        GeolocationManager.init();
        GeolocationBox.init();
        SearchBox.init();
        MapSwitcher.init();
        LocatorService.start("ws://127.0.0.1:9000/service");
    }
};
