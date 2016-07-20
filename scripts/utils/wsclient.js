/**
 * Websocket client
 */
"use strict";
var WSClient = {

    socket: null,
    host: null,

    onOpen: function() {
        console.log("onOpen");
    },

    onMessageReceived: function(evt) {
        console.log("onMessageReceived", evt.data);
    },

    onClose: function() {
        console.log("onClose");
    },

    onError: function(error) {
        console.log("onError", error);
    },

    init: function(host, features) {
        try {
            if(this.socket) {
                this.close();
            }
            this.socket = new WebSocket(host, features);
        } catch(ex) {
            alert(ex.message);
            return;
        }

        this.host = host;
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessageReceived;
        this.socket.onerror = this.onError;
        this.socket.onclose = this.onClose;
    },

    close: function(msg) {
        this.socket.close();
        this.socket = null;
    },

    sendMessage: function() {
        this.socket.send(msg);
    },

    reconnect: function() {
        this.socket.close();
        this.init(this.host);
    }
};
