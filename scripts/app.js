
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
        LocatorService.start("ws://127.0.0.1:9000/");

        /* Add default contacts */
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
