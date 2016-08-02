var MessageType = {
    SERVICE: 1,
    SERVICE_CMD: 2,
    BROADCAST: 3
};

var LocationClient = {
    opt: null,
    watchGeo: null,
    client: null,
    timeOut: 5000,

    init: function(host) {

        this.client = Object.create(WSClient);
        this.client.name = "Borislav";

        this.client.onOpen = this.onConnected.bind(this);
        this.client.onMessageReceived = this.onMessageReceived;
        this.client.onError = this.onError;
        // geolocation opt
        this.opt = { timeout: this.timeOut, enableHighAccuracy: true };

        this.startWatch(function(position) {
            alert("position");
            GeoMap.showLocatorPosition("Test", position);
            if(this.client.isConnected) {
                this.sendMessage(MessageType.SERVICE, position);
            }
        }, function(error) {
            console.log(error);
            if (error.code === error.TIMEOUT) {
                console.log("location timeout");
                return;
            }
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        });
        //connect to server
        this.client.init(host);
    },

    startWatch: function(success, fail) {
        console.log("startWatch()");
        
        if(this.watchGeo) {
            this.stopWatch();
        }
        //this.watchGeo = navigator.geolocation.watchPosition(success, fail, this.opt);
        var geoOpt = this.opt;
        this.watchGeo = setInterval(function() {
            navigator.geolocation.getCurrentPosition(success, fail, geoOpt);
        }, this.timeOut * 2);

    },

    stopWatch: function() {
        console.log("stopWatch()");
        //navigator.geolocation.clearWatch(this.watchGeo);
        clearInterval(this.watchGeo);
        this.watchGeo = null;
    },

    onConnected: function() {
        WSClient.onOpen.call(this);
        console.log("Client connected!");
        this.sendMessage(MessageType.SERVICE, "HELLO");
    },

    sendMessage: function(type, msg) {
        var pingMessage = {
            type: MessageType.SERVICE,
            user: this.client.name,
            message: msg
        };
        this.client.sendMessage(JSON.stringify(pingMessage));
    },

    onMessageReceived: function(evt) {
        console.log("recv: " + evt.data);
        var msg = null;
        try {
            msg = JSON.parse(evt.data);
        }
        catch(ex) {
            console.log("message parse error: ", ex.message);
        }
    },

    onError: function(error) {
        alert("Cleint error: " + JSON.stringify(error));
    }
};
