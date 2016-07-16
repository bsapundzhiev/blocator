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

	function listScore () {
		
		for(var name in participants){
			console.log(participants[name].name + " longitude: " + participants[name].location.coords.longitude + " latitude: " + participants[name].location.coords.latitude);
		}
	}

	var publicApi = {
		addParticipant: addParticipant,
		setLocationPoints: setLocationPoints,
		getLocationPoints: getLocationPoints,
		listScore: listScore
		
	};

	return publicApi;
})();
