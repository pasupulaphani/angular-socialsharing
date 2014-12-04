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
angular.module('socialsharing.services')
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
angular.module('socialsharing.services')
    .provider(
        "$twt",
        function() {

            var intent_url = 'https://twitter.com/intent';
            var chars_limit = 140;

            // https://support.twitter.com/articles/78124-posting-links-in-a-tweet
            var share_url_limit = 22;

            // defaults
            var config = {
                trim_text: false
            };

            var setDefaultProps = function(params) {
                angular.forEach(['text', 'url', 'hashtags'], function(prop) {
                    if (!params.hasOwnProperty(prop)) {
                        params[prop] = '';
                    }
                });
                return params;
            };

            // twitter count 2byte utf-8 char as 1.
            var getCharLeft = function(params) {

                // twitter automatically shortens it.
                var url_length = params.url.length > share_url_limit ? share_url_limit : params.url.length;
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
                        url_length +
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

                            var deferred = $q.defer();

                            deferred.promise
                                .then(function() {
                                    params.text = trimText();
                                })
                                .then(function() {
                                    openIntent();
                                });

                            deferred.resolve();
                        }
                    };
                }
            };
        });
angular.module('socialsharing.services')
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
    function loadSdkAsync(id, src) {
        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                console.warn("Skipping: Resource with id: " + id + " exists");
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = src;
            js.async = true;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', id));
    }

})(window, document);
