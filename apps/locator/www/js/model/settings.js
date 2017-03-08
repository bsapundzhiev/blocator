var SettingsModel = {

    user: null,
    gps: null,

    init: function() {
        this.user = { userName: _.uniqueId('User_'), service: "ws://calipso.no-ip.info:9000/client"};
        this.gps  = { timeout: 30000, enableHighAccuracy: true };
        this.restore();
    },

    restore: function() {
        var username = localStorage.getItem("username");
       
        if (username) {
            console.log("username: ", username);
            this.user = JSON.parse(username);
        }

        var gps = localStorage.getItem("gps");
        
        if (gps) {
            console.log("gps: ", gps);
            this.gps = JSON.parse(gps);
        }
    },

    store: function() {
        console.log("store username", this.user);
        localStorage.setItem("username", JSON.stringify(this.user));
        localStorage.setItem("gps", JSON.stringify(this.gps));
    },

    setUser: function(userName) {
        this.user.userName = userName;
        this.store(); 
    }
};