'use strict';

describe("$fb", function() {

    var provider, service;
    var $window, $timeout;

    beforeEach(module("socialsharing", function($provide, $fbProvider) {
        provider = $fbProvider;

        describe("$fbProvider", function() {
            it("should contain method init", function() {
                expect(provider.init).toBeDefined();
            });
        });

        // initialize
        provider.init(84804589457, {
            locale: 'de_DE',
            test: 'unknown'
        });

        $provide.decorator('$window', function($delegate) {

            $delegate.FB = jasmine.createSpy();
            $delegate.FB.ui = jasmine.createSpy();
            $delegate.FB.XFBML = {
                parse: jasmine.createSpy()
            };

            return $delegate;
        });
    }));

    beforeEach(inject(function($fb, _$window_) {
        service = $fb;
        $window = _$window_;
    }));

    describe("API to match specs:", function() {
        it("should contain method feed", function() {
            expect(service.feed).toBeDefined();
        });

        it("should contain method parse", function() {
            expect(service.parse).toBeDefined();
        });
    });

    describe("share via FB feed:", function() {
        it("should call FB ui", function() {

            service.feed({
                name: "Link name"
            });
            expect($window.FB.ui).toHaveBeenCalled();
        });

        it("do nothing if no params are passed", function() {

            service.feed();
            expect($window.FB.ui.calls.any()).toEqual(false);
        });
    });

    describe("parse XFBML when asked:", function() {
        it("should call FB XFBML parse", function() {

            service.parse();
            expect($window.FB.XFBML.parse).toHaveBeenCalled();
        });
    });


});
