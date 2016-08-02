var MessageType = {
    SERVICE: 1,
    SERVICE_CMD: 2,
    BROADCAST: 3
};

var LocationClient = {
    opt: null,
    watchGeo: null,
    client: null,
    timeOut: 30000,

    init: function(host) {

        this.client = Object.create(WSClient);
        this.client.name = "Borislav";

        this.client.onOpen = this.onConnected.bind(this);
        this.client.onMessageReceived = this.onMessageReceived;
        this.client.onError = this.onError;
        // geolocation opt
        this.opt = { timeout: this.timeOut, enableHighAccuracy: true };

        var locationCb = this.onLocation.bind(this);
        this.startWatch(locationCb, this.onError);
        //connect to server
        this.client.init(host);
    },

    startWatch: function(success, fail) {
        console.log("startWatch()");
        
        if(this.watchGeo) {
            this.stopWatch();
        }
        this.watchGeo = navigator.geolocation.watchPosition(success, fail, this.opt);

    },

    stopWatch: function() {
        console.log("stopWatch()");
        navigator.geolocation.clearWatch(this.watchGeo);
        this.watchGeo = null;
    },

    onLocation: function(position) {
        GeoMap.showLocatorPosition(this.client.name, position);
        //send location to service
        var location = {
            coords: { 
                latitude:position.coords.latitude,
                longitude: position.coords.longitude
            }
        };
        this.sendMessage(MessageType.SERVICE, location);
    },

    onConnected: function() {
        WSClient.onOpen.call(this);
        console.log("Client connected!");
        this.sendMessage(MessageType.BROADCAST, "HELLO");
    },

    sendMessage: function(type, msg) {
        console.log(msg);

        var pingMessage = {
            type: MessageType.SERVICE,
            user: this.client.name,
            message: msg,
            date: Date.now()
        };

        console.log("client.isConnected: ", this.client.isConnected);

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
        console.log("client error", error);
        if(error.target) {
            alert("Cleint error: " + JSON.stringify(error.target.readyState));
        } else {
            alert("Cleint error: " + JSON.stringify(error));    
        }
        
    }
};
