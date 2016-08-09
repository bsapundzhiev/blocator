/**
 * Locator service client
 */

var LocationClient = {
    opt: null,
    watchGeo: null,
    client: null,

    startWatch: function(settings) {
        console.log("startWatch()");
        if(this.watchGeo) {
            this.stopWatch();
        }

        this.client = Object.create(WSClient);
        this.client.name = settings.user.userName;
        this.client.id = _.uniqueId("uid_");

        this.client.onOpen = this.onConnected.bind(this);
        this.client.onMessageReceived = this.onMessageReceived;
        this.client.onError = this.onError;
        this.client.onClose = this.onClose;
        // geolocation opt
        var locationCb = this.onLocation.bind(this);
        //connect to server
        this.client.init(settings.user.service);
        this.watchGeo = navigator.geolocation.watchPosition(locationCb, this.onError, settings.gps);
    },

    stopWatch: function() {
        console.log("stopWatch()");
        navigator.geolocation.clearWatch(this.watchGeo);
        this.watchGeo = null;
        this.client.close();
        delete this.client;
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

    sendMessage: function(type, data) {
        var message = Object.create(Message);
        message.setData(this.client, type, data);
        console.log(message.getData());
        this.client.sendMessage(message.getData());
    },

    onMessageReceived: function(evt) {
        console.log("recv: " + evt.data);
        var msg = null;
        try {
            msg = JSON.parse(evt.data);
            alert(msg);
        } catch(ex) {
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

    },
    onClose: function(evt) {
        console.log("onClose", evt);
        alert("Server close the connection");
    }
};
