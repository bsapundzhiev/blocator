var SettingsModel = {

    user: null,
    gps: null,

    init: function() {
        this.user = { userName: "Borislav", service: "ws://calipso.no-ip.info:9000/client"};
        this.gps  = { timeout: 30000, enableHighAccuracy: true };
        this.restore();
    },

    restore: function() {

    },
    store: function() {

    }
};