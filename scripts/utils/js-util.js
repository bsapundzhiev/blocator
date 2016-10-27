var JSUtil = {
    extend: function(subClass, superClass) {
        var F = function() {
        };
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
        subClass.superclass = superClass.prototype;

        if (superClass.prototype.constructor === Object.prototype.constructor) {
            superClass.prototype.constructor = superClass;
        }
    },

    ajaxCall: function(method, path, successCallback, errorCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, path, true);
        xhr.responseType = "arraybuffer";

        xhr.onload = function(e) {
            successCallback(this.response);
        };

        xhr.onerror = function(e) {
            errorCallback(e.target.statusText || "ajaxCallerror");
        }

        xhr.send();
    },

    getBlobFromImagePath: function(imagePath, successCallback, errorCallback) {
        this.ajaxCall("GET", imagePath, function(response) {
            var arrayBufferView = new Uint8Array(response);
            var blob = new Blob([arrayBufferView], {type: "image/jpeg"});

            successCallback(blob);
        }, errorCallback);
    },

    hashCode: function(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = ~~(((hash << 5) - hash) + str.charCodeAt(i));
        }
        return hash;
    },

    bearingWordTo: function(bearing) {
        var bearingword = '';
        if      (bearing >=  22 && bearing <=  67) bearingword = 'NE';
        else if (bearing >=  67 && bearing <= 112) bearingword =  'E';
        else if (bearing >= 112 && bearing <= 157) bearingword = 'SE';
        else if (bearing >= 157 && bearing <= 202) bearingword =  'S';
        else if (bearing >= 202 && bearing <= 247) bearingword = 'SW';
        else if (bearing >= 247 && bearing <= 292) bearingword =  'W';
        else if (bearing >= 292 && bearing <= 337) bearingword = 'NW';
        else if (bearing >= 337 || bearing <=  22) bearingword =  'N';
        return bearingword;
    }

};
