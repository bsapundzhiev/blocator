/**
 * Websocket client
 * Author: Borislav Sapundzhiev (c) 2016
 */
"use strict";
var WSClient = {

    socket: null,
    host: null,
    isConnected: false,

    onOpen: function() {
        console.log("onOpen");
        this.isConnected = true;
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

    close: function() {
        this.socket.close();
        this.socket = null;
        this.isConnected = false;
    },

    sendMessage: function(msg) {
        this.socket.send(msg);
    },

    reconnect: function() {
        this.socket.close();
        this.init(this.host);
    }
};
