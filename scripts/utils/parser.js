/*
 * Author: Borislav Sapundzhiev (c) 2016
 * License: Beerware, MIT
 */
var GPXParser = (function() {

    exports = {};

    function parseFile(file) {

        var reader = new FileReader();
        reader.onload = function(event) {
          var textFile = event.target;
          parse(textFile.result);
        };
        reader.onerror = function(event) {
          alert("File reader Error");
        };

        reader.readAsText(file);
    }

    function parse(XMLstr) {
        var oParser = new DOMParser();
        var oDOM = oParser.parseFromString(XMLstr, "text/xml");

        if(oDOM.documentElement.nodeName != 'gpx') {
          throw("File has no gpx data");
        }

        var gpxData = xmlToJson(oDOM).gpx;
        if(exports.process) {
          exports.process(gpxData);
        }
    }

    //
    //https://davidwalsh.name/convert-xml-json
    //
    function xmlToJson(xml) {

      // Create the return object
      var obj = {};

      if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
          //obj["attributes"] = {};
          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            //obj["attributes"][attribute.nodeName] = attribute.nodeValue;
            obj['@' + attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue.trim(); // add trim here
      }

      // do children
      if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nodeName = item.nodeName;
          //  console.debug('child',nodeName,item)
          if (typeof(obj[nodeName]) == "undefined") {
            var tmp = xmlToJson(item);
            if (tmp !== "") // if not empty string
              obj[nodeName] = tmp;
          } else {
            if (typeof(obj[nodeName].push) == "undefined") {
              var old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            var tmp = xmlToJson(item);
            if (tmp !== "") // if not empty string
              obj[nodeName].push(tmp);
          }
        }
      }
      if (!Array.isArray(obj) && typeof obj == 'object') {
        var keys = Object.keys(obj);
        if (keys.length == 1 && keys[0] == '#text') return obj['#text'];
        if (keys.length === 0) return null;
      }
      return obj;
    }
    //
    //Ajax call
    //
    function makeRequest (method, url) {

      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
          if (this.status >= 0 && this.status < 300) {
            resolve(xhr.response);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };
        xhr.send();
      });
    }

    exports.parse = parse;
    exports.parseFile = parseFile;
    exports.makeRequest = makeRequest;
    exports.process = null;
    return exports;

})();