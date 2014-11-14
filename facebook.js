
angular.module('socialSharing')


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
        };

        this.init = function(fb_id, fb_config) {

            id = fb_id;

            if (fb_config) {

                angular.forEach(fb_config, function(value, key) {

                    if (config.hasOwnProperty(key)) {
                        config[key] = value;
                    } else {
                        console.warn("Ignoring unknown config: " + key)
                    };
                })
            };
            loadSdkAsync('facebook-jssdk', ['//connect.facebook.net', config.locale, 'all.js'].join('/'));
        };

        function Facebook($window) {
            this.$window = $window;
            fbAsyncInit($window);
        };

        Facebook.prototype.feed = function(params) {

            if (!params) {
                return
            };

            params.display = params.display || 'popup';
            params.method = 'feed';

            if (this.$window.FB) {
                FB.ui(params, function(response) {});
            } else {
                throw "FB is not available/initialized"
            }
        };

        return {
            init: this.init,
            $get: function($window) {
                return new Facebook($window);
            }
        }
    });