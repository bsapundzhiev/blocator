/**
 * Locator manager
 */
"use strict";
var LocatorBoard = (function () {
	
	var participants = {};

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

	var publicApi = {
		addParticipant: addParticipant,
		setLocationPoints: setLocationPoints,
		getLocationPoints: getLocationPoints,
		listParticipants: listParticipants,
		getCurrentPosition:getCurrentPosition
	};

	return publicApi;
})();
