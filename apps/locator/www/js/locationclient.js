/**
 * Locator service client
 */

var LocationClient = {
    opt: null,
    client: null,
    position: null,
    startWatch: function(settings) {
        console.log("startWatch()");
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

        backgroundGeolocation.stop();
        backgroundGeolocation.configure(locationCb, this.onError, {
            desiredAccuracy: 10,
            notificationIconColor: '#4CAF50',
            notificationTitle: 'Background tracking',
            notificationText: 'ENABLED',
            notificationIconLarge: 'icon_large', //filename without extension
            notificationIconSmall: 'icon_small', //filename without extension
            //debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: true, // <-- enable this to clear background location settings when the app terminates
            locationProvider: backgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
            interval: 5000, // <!-- poll for position every minute
            fastestInterval: 5000
        });
        backgroundGeolocation.start();
    },

    stopWatch: function() {
        console.log("stopWatch()");
        backgroundGeolocation.stop();
        this.client.close();
        delete this.client;
    },

    onLocation: function(location) {
        console.log("onLocation", location);

        this.position = {
            coords: {
                longitude: location.longitude,
                latitude: location.latitude
            },
            accuracy: location.accuracy,
            altitude: location.altitude,
            provider: location.provider,
            bearing : location.bearing,
            time: location.time
        };

        GeoMap.showLocatorPosition(this.client.name, this.position);
        this.sendMessage(MessageType.SERVICE, this.position);
        backgroundGeolocation.finish();
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
        //https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
        alert("Server close the connection: " + event.code + "\nreason:" + event.reason);
    }
};
