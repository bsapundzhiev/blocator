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

        /*navigator.geolocation.getCurrentPosition(function(position) {
            GeoMap.showLocatorPosition("Test", position);
        }, function(error) {
            console.log(error);
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }, {maximumAge: 0, timeout: 10000, enableHighAccuracy: true});*/

        this.startWatch(function(position) {
            alert("position: ", JSON.stringify(position));
            GeoMap.showLocatorPosition("Test", position);
            if(this.client.isConnected) {
                this.sendMessage(MessageType.SERVICE, position);
            }
        }, function(error) {
            console.log(error);
            //PositionError.TIMEOUT
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        });
        //connect to server
        this.client.init(host);
    },

    startWatch: function(success, fail) {
        console.log("startWatch()");
        this.opt = { timeout: this.timeOut, enableHighAccuracy: true };
        if(this.watchGeo) {
            this.stopWatch();
        }
        this.watchGeo = navigator.geolocation.watchPosition(success, fail, this.opt);
    },

    stopWatch: function() {
        console.log("stopWatch()");
        navigator.geolocation.clearWatch(this.watchGeo);
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
