var SettingsModel = {

    user: null,
    gps: null,

    init: function() {
        this.user = { userName: _.uniqueId('User_'), service: "ws://calipso.no-ip.info:9000/client"};
        this.gps  = { timeout: 30000, enableHighAccuracy: true };
        this.restore();
    },

    restore: function() {

        if (localStorage.getItem("username")) {
            this.user = localStorage.getItem("username");
        }

       if(localStorage.getItem("gps")) {
            this.gps = localStorage.getItem("gps");
        }
    },

    store: function() {
        localStorage.setItem("username", this.user);
        localStorage.setItem("gps", this.gps);
    },

    setUser: function(userName) {
        this.user.userName = userName;
        this.store(); 
    }
};