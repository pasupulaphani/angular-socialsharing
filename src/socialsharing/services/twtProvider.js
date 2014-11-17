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
