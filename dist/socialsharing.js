(function(window, document) {

// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('socialsharing.config', [])
    .value('socialsharing.config', {
        debug: true
    });

// Modules
angular.module('socialsharing.services', []);
angular.module('socialsharing',
    [
        'socialsharing.config',
        'socialsharing.services'
    ]);
angular.module('socialSharing.services')
    .provider(
        "$fb",
        function() {

            var id;

            // defaults
            var config = {
                locale: 'en_US',
                channel: 'app/channel.html'
            };

            function fbAsyncInit($window) {
                if (id) {
                    $window.fbAsyncInit = function() {
                        FB.init({
                            appId: id,
                            channelUrl: config.channel,
                            status: true,
                            xfbml: true
                        });
                    };

                } else {
                    throw ("FB App Id Cannot be blank");
                }
            }

            this.init = function(fb_id, fb_config) {

                id = fb_id;

                if (fb_config) {

                    angular.forEach(fb_config, function(value, key) {

                        if (config.hasOwnProperty(key)) {
                            config[key] = value;
                        } else {
                            console.warn("Ignoring unknown config: " + key);
                        }
                    });
                }
                loadSdkAsync('facebook-jssdk', ['//connect.facebook.net', config.locale, 'all.js'].join('/'));
            };

            function Facebook($window) {
                this.$window = $window;
                fbAsyncInit($window);
            }

            Facebook.prototype.feed = function(params) {

                if (!params) {
                    return;
                }

                params.display = params.display || 'popup';
                params.method = 'feed';

                if (this.$window.FB) {
                    FB.ui(params, function(response) {});
                } else {
                    throw "FB is not available/initialized";
                }
            };

            return {
                init: this.init,
                $get: function($window) {
                    return new Facebook($window);
                }
            };
        });
angular.module('socialSharing.services')
    .provider(
        "$twt",
        function() {

            var intent_url = 'https://twitter.com/intent';
            var chars_limit = 140;

            // defaults
            var config = {
                shorten_url: false,
                trim_text: false
            };

            var setDefaultProps = function(params) {
                angular.forEach(['text', 'url', 'hashtags'], function (prop) {
                    if (!params.hasOwnProperty(prop)) {
                        params[prop] = '';
                    }
                });
                return params;
            };

            // twitter count 2byte utf-8 char as 1.
            var getCharLeft = function(params) {

                var hashtags_num = params.hashtags === '' ? 0 : params.hashtags.split(',').length;
                var hashtags_spaces;

                switch (hashtags_num) {
                    case 0:
                        hashtags_spaces = 1;
                        break;
                    case 1:
                        hashtags_spaces = 3;
                        break;
                    default:
                        hashtags_spaces = hashtags_num * 2;
                }

                return (chars_limit -
                    (params.text.length +
                        params.url.length +
                        params.hashtags.length +
                        hashtags_spaces + 2)
                );
            };

            this.setConfig = function(twt_config) {

                if (twt_config) {

                    angular.forEach(twt_config, function(value, key) {

                        if (config.hasOwnProperty(key)) {
                            config[key] = value;
                        } else {
                            console.warn("Ignoring unknown config: " + key);
                        }
                    });
                }
            };

            loadSdkAsync('twitter-wjs', 'https://platform.twitter.com/widgets.js');

            return {
                setConfig: this.setConfig,
                $get: function($window, $q, utils) {
                    return {
                        intent: function(type, params) {

                            params = setDefaultProps(params);

                            var openIntent = function() {
                                var twt_intent = [intent_url, '/', type, '?', utils.encode(params)].join('');
                                $window.open(twt_intent, '', 'toolbar=0, status=0, width=550, height=420');
                            };

                            var trimText = function() {

                                var chars_left = getCharLeft(params);

                                if (config.trim_text && chars_left < 0) {
                                    var new_len = params.text.length + chars_left - 3;
                                    return params.text.substring(0, new_len).trim() + '...';
                                } else {
                                    return params.text;
                                }
                            };

                            var shortenURL = function() {

                                var promise;
                                if (config.shorten_url && getCharLeft(params) < 0) {
                                    promise = utils.shortenURL(params.url)
                                        .then(function(short_url) {
                                            return short_url;
                                        });
                                } else {
                                    promise = $q.when(params.url);
                                }

                                return promise;
                            };

                            shortenURL()
                                .then(function(url) {
                                    params.url = url;
                                })
                                .then(function() {
                                    params.text = trimText();
                                })
                                .then(function() {
                                    openIntent();
                                });
                        }
                    };
                }
            };
        });
angular.module('socialSharing.services')
    .factory(
        "utils",
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
                },
                shortenURL: function(url) {

                    var googl_shorten_api = 'https://www.googleapis.com/urlshortener/v1/url';
                    var data = {
                        longUrl: url
                    };

                    var promise = $http.post(googl_shorten_api, data)
                        .then(function(response) {

                                $log.info("Shortening url success");
                                $log.info(response.data.longUrl + ' --> ' + response.data.id);
                                return response.data.id;
                            },
                            function(error) {

                                $log.warn("Failed to shorten url");
                                return url;
                            });

                    return promise;
                }
            };
        });
})(window, document);