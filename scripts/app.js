
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

        /* Add default contacts */
        LocatorBoard.addParticipant("Borislav");
        //LocatorBoard.setLocationPoints("Borislav", { coords:{longitude: 25.5996566, latitude: 43.1786099} });

        LocatorBoard.setLocationPoints("Borislav", { coords:{longitude: 25.5996566, latitude: 43.1786099} });

        //GeoMap.showPosition(LocatorBoard.getLocationPoints("Borislav"));

        GeoMap.showLocatorPosition("Borislav", LocatorBoard.getLocationPoints("Borislav"));

        GeolocationBox.updateLocators(LocatorBoard.listParticipants());

        var client = Object.create(WSClient);
        client.init("ws://calipso.no-ip.info:9000/");
        client.onOpen = function() { alert("Open"); }
        client.onMessageReceived = function(evt) {
            console.log("recv: " + evt.data);
        }

        /*JSUtil.ajaxCall("GET", "https://bsapundzhiev.github.io/geo/", function(blob) {
            console.log(blob)
        }, function(err) {
            alert(err);
        });*/

        // JSUtil.getBlobFromImagePath("img/end3r.jpeg", function(blob) {

        //     /* Add default contacts to the address book */
        //     ContactManager.addContact({
        //         name: ["Andrzej Mazur"],
        //         givenName: ["Andrzej"],
        //         familyName: ["Mazur"],
        //         nickname: ["end3r"],
        //         photo: null, //[blob],
        //         adr: [{
        //                 locality: "Warsaw",
        //                 countryName: "Poland"
        //             }]
        //     },
        //     function() {
        //         console.log('Contact added successfully');
        //     }, function() {
        //         console.log('Error adding contact to the address book');
        //     });

        // });

        // JSUtil.getBlobFromImagePath("img/chrisdavidmills.jpg", function(blob) {
        //     ContactManager.addContact({
        //         name: ["Chris Mills"],
        //         givenName: ["Chris"],
        //         familyName: ["Mills"],
        //         nickname: ["chrisdavidmills"],
        //         photo: null, //[blob],
        //         adr: [{
        //                 locality: "Oldham",
        //                 countryName: "UK"
        //             }]
        //     },
        //     function() {
        //         console.log('Contact added successfully');
        //     }, function() {
        //         console.log('Error adding contact to the address book');
        //     });
        // });

        // JSUtil.getBlobFromImagePath("img/franciov.jpeg", function(blob) {
        //     ContactManager.addContact({
        //         name: ["Francesco Iovine"],
        //         givenName: ["Francesco"],
        //         familyName: ["Iovine"],
        //         nickname: ["franciov"],
        //         photo: null, //[blob],
        //         adr: [{
        //                 locality: "Rome",
        //                 countryName: "Italy"
        //             }]
        //     },
        //     function() {
        //         console.log('Contact added successfully');
        //     }, function() {
        //         console.log('Error adding contact to the address book');
        //     });
        // });
    }
};
