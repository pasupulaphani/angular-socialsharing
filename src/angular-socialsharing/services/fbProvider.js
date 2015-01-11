angular.module('socialsharing.services')
    .provider(
        '$fb',
        function() {

            var id;

            // defaults
            var config = {
                locale: 'en_US',
                channel: 'app/channel.html'
            };

            function fbAsyncInit(callback) {
                if (id) {
                    window.fbAsyncInit = function() {
                        FB.init({
                            appId: id,
                            channelUrl: config.channel,
                            status: true,
                            xfbml: true
                        });
                    };

                } else {
                    throw ('FB App Id Cannot be blank');
                }
            }

            this.init = function(fb_id, fb_config) {

                id = fb_id;

                if (fb_config) {

                    angular.forEach(fb_config, function(value, key) {

                        if (config.hasOwnProperty(key)) {
                            config[key] = value;
                        } else {
                            if (console) console.warn('Ignoring unknown config: ' + key);
                        }
                    });
                }

                loadSdkAsync('facebook-jssdk', ['//connect.facebook.net', config.locale, 'all.js'].join('/'));

                fbAsyncInit();
            };

            function Facebook($window) {
                this.$window = $window;
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
                    throw new Error('FB is not available/initialized');
                }
            };


            // this will parse the document (or given element)
            // this will generate fb elements(like, share buttons)
            Facebook.prototype.parse = function(ele) {

                ele = ele || document;
                FB.XFBML.parse(ele);
            };

            return {
                init: this.init,
                $get: function($window) {
                    return new Facebook($window);
                }
            };
        });
