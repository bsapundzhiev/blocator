/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var MessageType = {
    SERVICE: 1,
    SERVICE_CMD: 2,
    BROADCAST: 3
};

var LocationClient = {
    opt: null,
    watchGeo: null,
    client: null,
    init: function() {

        this.client = Object.create(WSClient);
        this.client.name = "Borislav";

        this.client.onOpen = this.onConnected.bind(this);

        this.client.onMessageReceived = function(evt) {
            console.log("recv: " + evt.data);
            var msg = null;
            try{
              msg = JSON.parse(evt.data);
            }
            catch(ex) {
                console.log("message parse error: ", ex.message);
            }
        };

        this.client.onError = function(error) {
            alert(error);
        }

        this.client.init("ws://100.102.0.224:9000/client");
    },

    startWatch: function(success, fail) {
        console.log("startGeoWatch()");
        this.opt = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: false };
        this.watchGeo = navigator.geolocation.watchPosition(success, fail, this.opt);
    },

    stopWatch: function() {
        console.log("stopGeoWatch()");
        navigator.geolocation.clearWatch(this.watchGeo);
    },

    onConnected: function() {
        WSClient.onOpen.call(this);
        console.log("Client connected!");

        this.sendMessage(MessageType.SERVICE, "HELLO");
        this.startWatch(function(position) {
            GeoMap.showPosition(position);
            //position.coords.latitude
            //position.coords.longitude
            console.log("position: ", position);
            this.sendMessage(MessageType.SERVICE, position);
        }, function(error) {
            //PositionError.TIMEOUT
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        });
    },

    sendMessage: function(type, msg) {
        var pingMessage = {
            type: MessageType.SERVICE,
            user: this.client.name,
            message: msg
        };
        this.client.sendMessage(JSON.stringify(pingMessage));
    }
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        // init map
        GeoMap = new OpenStreetMap({
            cordova: true,
            mapType: 'openstreetmap',
            mapId: 'openstreetmap'
        });

        /* Initializes the map and the search box */
        //GeoMap.offline = true;
        GeoMap.initMap();
        LocationClient.init();

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();