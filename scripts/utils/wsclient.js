/**
 * Websocket client
 */
"use strict";
var WSClient = {

    ws: null,

    onOpen: function() {
        console.log("onOpen");
    },

    onMessageReceived: function(evt) {
        var received_msg = evt.data;
        console.log("Message is received..." + received_msg);
    },

    onClose: function() {
        console.log("Connection is closed...");
    },

    onError: function(error) {
        console.log(error);
    },

    init: function(url, features)
    {
        if (!("WebSocket" in window)) {
           alert("WebSocket is NOT supported!");
           return;
        }

        this.ws = new WebSocket(url, features);
        this.ws.onopen = this.onOpen;
        this.ws.onmessage = this.onMessageReceived;
        this.ws.onerror = this.onError;
        this.ws.onclose = this.onClose;
    }

};
