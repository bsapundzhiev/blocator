
var ContactManager = {
    /* 
     * init
     * Initialize the object
     */
    init: function() {
        console.log('ContactManager.init()');
    },
    /*
     * isContactsApiSupported
     * Checks whether the Contacts API is supported
     * @returns {Boolean}
     */
    isContactsApiSupported: function() {

        if (window.navigator.mozContacts) {
            return true;
        }

        return false;
    },
    /*
     * isContact
     * Checks whether the contact passed as parameter is a mozContact
     * @param {mozContact?} contact
     * @returns {Boolean}
     */
    isContact: function(contact) {

        if (this.isContactsApiSupported()) {
            if (contact instanceof mozContact) {
                return true;
            }
        }

        return false;
    },
    /*
     * addContact
     * Adds a contact to the address book
     * @param {mozContact} contact
     * @param {Function} successCallBack
     * @param {Function} errorCallback
     */
    addContact: function(contact, successCallBack, errorCallback) {
        console.log('ContactManager.addContact(contact, successCallBack, errorCallback)');
        console.log(contact);

        if (this.isContactsApiSupported() === false) {
            console.log("isContactsApiSupported == false");
            errorCallback();
            return;
        }

        var self = this;

        ContactManager.findContact({
            filterBy: ['name'],
            filterValue: contact.name,
            filterOp: 'equals'

        }, function(contactsFound) { // success callback

            if (contactsFound.length === 0) {
                /* Add contact */

                var saving = self.contactManagerInterface.save(new mozContact(contact));

                saving.onsuccess = function() {
                    console.log('new contact saved');
                    successCallBack();
                };

                saving.onerror = function(error) {
                    console.log(error);
                    errorCallback();
                };
            }
            else {
                console.log(contact.name + ' already exists');
            }

        }, function() { // error callback
            errorCallback();
            return;
        });
    },
    /*
     * addAddressToContact
     * Adds address info to a contact
     * @param {String} address
     * @param {mozContact} contact
     * @param {Function} successCallback
     * @param {Function} errorCallback
     */
    addAddressToContact: function(address, contact, successCallback, errorCallback) {
        console.log('ContactManager.addAddressToContact(address, contact, successCallBack, errorCallback)');
        console.log(address);
        console.log(contact);

        if (this.isContactsApiSupported() === false) {
            return;
        }

        contact.adr = [{
                streetAddress: address
            }];

        var saving = window.navigator.mozContacts.save(contact);

        saving.onsuccess = function() {
            console.log('the address was inserted correctly');
            successCallback();
        };

        saving.onerror = function(error) {
            console.log("error in inserting address");
            console.log(error);
            errorCallback();
        };
    },
    /*
     * contactAddressToString
     * Makes a contact address printable as a string
     * @param {type} contact
     * @returns {String}˙
     */
    contactAddressToString: function(contact) {
        console.log('ContactManager.contactAddressToString(contact)');
        console.log(contact);

        /* Build a query search string */
        var contactAddress = contact.adr[0];
        var addressString = '';

        console.log(contactAddress);

        addressString += contactAddress.streetAddress ? (contactAddress.streetAddress + ' ') : '';
        addressString += contactAddress.locality ? (contactAddress.locality + ' ') : '';
        addressString += contactAddress.region ? (contactAddress.region + ' ') : '';
        addressString += contactAddress.postalCode ? (contactAddress.postalCode + ' ') : '';
        addressString += contactAddress.countryName ? (contactAddress.countryName + ' ') : '';

        return addressString;
    },
    /*
     * findContact
     * Finds a contact in the address book
     * @param {Object} filter
     * @param {Function} successCallback
     * @param {Function} errorCallback
     */
    findContact: function(filter, successCallback, errorCallback) {
        console.log('ContactManager.findContact(filter)');
        console.log(filter);

        if (this.isContactsApiSupported() === false) {
            errorCallback();
            return;
        }

        var request = window.navigator.mozContacts.find(filter);

        request.onsuccess = function() {
            console.log(this.result.length + ' contacts found.');
            successCallback(this.result);
        };

        request.onerror = function() {
            console.log('findContact error');
            errorCallback();
        };
    },
    /*
     * getAllContacts
     * Retrieves all contacts from the address book
     * @param {Function} successCallback
     * @param {Function} errorCallback
     */
    getAllContacts: function(successCallback, errorCallback) {
        console.log('ContactManager.getAllContacts()');

        if (this.isContactsApiSupported() === false) {
            errorCallback();
            return;
        }

        var allContacts = window.navigator.mozContacts.getAll({
            // no options
        });

        allContacts.onsuccess = function(event) {
            if (this.result) {
                successCallback(this.result);
                this.continue();
            }
        };

        allContacts.onerror = function() {
            console.log('getAllContacts error');
            errorCallback();
        };
    },
    /*
     * removeContact
     * Removes a contact from the address book
     * @param {mozContact} contact
     * @param {Function} successCallback
     * @param {Function} errorCallback
     */
    removeContact: function(contact) {
        console.log('ContactManager.removeContact()');

        if (this.isContactsApiSupported() === false) {
            return;
        }

        var request = window.navigator.mozContacts.clear(contact);

        request.onsuccess = function() {
            console.log('The contact have been removed.');
        };

        request.onerror = function() {
            console.log('No contacts were removed.');
        };
    },
    /*
     * clearContacts
     * Removes all contacts from the address book
     * @param {Function} successCallback
     * @param {Function} errorCallback
     */
    clearContacts: function() {
        console.log('ContactManager.clearContacts()');

        if (this.isContactsApiSupported() === false) {
            return;
        }

        var request = window.navigator.mozContacts.clear();

        request.onsuccess = function() {
            console.log('All contacts have been removed.');
        };

        request.onerror = function() {
            console.log('No contacts were removed.');
        };
    }
};
