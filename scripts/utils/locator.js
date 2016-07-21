/**
 * Locator manager
 * Author: Borislav Sapundzhiev (c) 2016
 */
"use strict";
/**
 * Holds participant data
 * @param {String} name
 */
function Participant (name) {
    this.name = name;
    this.givenName = null;
    this.nickName = null;
    this.photo = null;
    this.adr = [{
        locality: null,
        countryName: null,
    }];

    this.location = {};

    this.setLocation = function(location) {
        this.location = location;
    }

    this.getLocation = function () {
        return this.location;
    }
}
/**
 * Locator service client
 */
var LocatorService = (function () {

	var participants = {};
    var client = null;
	/**
	 * Adds pariticipant to the locatorboard
	 * @param {String} name
	 */
	function addParticipant (name) {
		participants[name] = new Participant(name);
	}

	/**
	 * Increment participant points
	 * @param  {String} participantName
	 * @param  {Number} points
	 * @return {Void}
	 */
	function setLocationPoints (participantName, points) {

		participants[participantName].setLocation(points);

	}

	function getLocationPoints(participantName) {
		return participants[participantName].getLocation();
	}

	function listParticipants() {
		var result =[];
		for(var name in participants){
			console.log(participants[name].name + " longitude: " + participants[name].location.coords.longitude + " latitude: " + participants[name].location.coords.latitude);
			result.push(name);
		}

		return result;
	}

    /*
     * getCurrentPosition
     * Gets the current position of the device
     * @param {Function} successCallback
     * @param {Function} errorCallback
     * @param {PositionOptions} positionOptions
     */
    function getCurrentPosition(successCallback, errorCallback, positionOptions) {
        console.log('LocatorBoard.getCurrentPosition(successCallback, errorCallback, options)');
    }

    function start(serviceHost) {

        client = Object.create(WSClient);

        client.onOpen = function() {
            WSClient.onOpen.call(this);
            console.log("Client connected!");

            var ms = {
                user:"Borislav",
                message: "Hello world"
            };
            client.sendMessage(JSON.stringify(ms));
        }

        client.onMessageReceived = function(evt) {
            console.log("recv: " + evt.data);
            var msg = null;
            try{
              msg = JSON.parse(evt.data);
            }
            catch(ex) {
                console.log("message parse error: ", ex.message);
            }
        }

        client.init(serviceHost);

        addParticipant("Borislav");
        setLocationPoints("Borislav", { coords:{longitude: 25.5996566, latitude: 43.1786099} });

        //GeoMap.showPosition(LocatorBoard.getLocationPoints("Borislav"));

        GeoMap.showLocatorPosition("Borislav", LocatorService.getLocationPoints("Borislav"));

        GeolocationBox.updateLocators(listParticipants());
    }


	var publicApi = {
        start: start,
		addParticipant: addParticipant,
		setLocationPoints: setLocationPoints,
		getLocationPoints: getLocationPoints,
		listParticipants: listParticipants,
		getCurrentPosition:getCurrentPosition
	};

	return publicApi;
})();
