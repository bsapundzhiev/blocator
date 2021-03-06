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
var ViewModel = {

    settings: null,

    init: function() {
        this.settings = Object.create(SettingsModel);
        this.settings.init();

        GPXParser.process = this.onGpxData.bind(this);
        this.updateSettings(this.settings);
    },

    onSwitchCommand: function(onoff) {
        //Location service command
        if(onoff) {
            LocationClient.startWatch(this.settings);
        } else {
            LocationClient.stopWatch();
        }
    },

    onRegister: function (userSettings) {
        this.settings.setUser(userSettings);
        this.updateSettings(this.settings);
    },

    onFileSelected: function(gpxFile) {
        GPXParser.parseFile(gpxFile);
    },

    onGpxData: function(data) {

        var segments = GPXParser.gpxGetSegments(data);
        var geoJsonFeature =  { "type": "LineString", "coordinates": [] };
        for (var index = 0; index < segments.length; index++) {
            var segment = segments[index];
            geoJsonFeature.coordinates.push([segment['@lon'], segment['@lat']]);
        }

        GeoMap.loadGeoJSON(geoJsonFeature);
    }
};

var app = {
    menuView: null,
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
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        // init map
        GeoMap = new OpenStreetMap({
            mapType: 'openstreetmap',
            mapId: 'openstreetmap',
            defaultZoom: 12
        });

        GeoMap.cordova = true;
        GeoMap.mapTiles = 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png';
        //GeoMap.mapTiles = 'img/mapTiles/{z}/{x}/{y}.png';

        GeoMap.initMap();

        menuView = Object.create(MenuView);
        menuView.init(ViewModel);

        ViewModel.init();

    }
};

app.initialize();