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
                            if(console) console.warn("Ignoring unknown config: " + key);
                        }
                    });
                }
            };

            loadSdkAsync('twitter-wjs', 'https://platform.twitter.com/widgets.js');

            return {
                setConfig: this.setConfig,
                $get: function($window, $q, ssUtils) {
                    return {
                        intent: function(type, params) {

                            params = setDefaultProps(params);

                            var openIntent = function() {
                                var twt_intent = [intent_url, '/', type, '?', ssUtils.encode(params)].join('');
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
