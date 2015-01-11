angular.module('socialsharing.services')
    .factory(
        "ssUtils",
        function($log, $http) {

            return {
                encode: function(params) {

                    var encodedStr = "";

                    // We loop over all the keys so we encode them.
                    for (var key in params) {
                        if (params.hasOwnProperty(key)) {

                            if (encodedStr && encodedStr[encodedStr.length - 1] !== "&") {
                                encodedStr = encodedStr + "&";
                            }

                            var value = params[key];

                            if (value instanceof Array) {
                                for (var i = 0; i < value.length; i++) {
                                    encodedStr = encodedStr + key + "=" + encodeURIComponent(value[i]) + "&";
                                }
                            } else if (typeof value === "object") {
                                for (var innerKey in value) {
                                    if (value.hasOwnProperty(innerKey)) {
                                        var innerValue = value[innerKey];
                                        encodedStr = encodedStr + key + "=" + encodeURIComponent(value[innerKey]) + "&";
                                    }
                                }
                            } else {
                                encodedStr = encodedStr + key + "=" + encodeURIComponent(value);
                            }
                        }
                    }

                    if (encodedStr[encodedStr.length - 1] === '&') {
                        encodedStr = encodedStr.substr(0, encodedStr.length - 1);
                    }

                    return encodedStr;
                }
            };
        });
