'use strict';

describe("$twt :", function() {

    var provider, service, $window;

    beforeEach(module("socialsharing", function($provide, $twtProvider) {
        provider = $twtProvider;

        describe("$twtProvider", function() {
            it("should contain method init", function() {
                expect(provider.init).toBeDefined();
            });

            it("should contain method trimText", function() {
                expect(provider.trimText).toBeDefined();
            });
        });

        provider.init()
            .trimText(true);

        $provide.decorator('$window', function($delegate) {

            $delegate.open = jasmine.createSpy();

            return $delegate;
        });
    }));

    beforeEach(inject(function($twt, _$window_) {
        service = $twt;
        $window = _$window_;
    }));

    describe("API to match specs:", function() {
        it("should contain method intent", function() {
            expect(service.intent).toBeDefined();
        });
    });

    describe("calling intent:", function() {

        it("should open twt window", function() {
            service.intent('tweet', {});
            // expect($window.open).toHaveBeenCalled();
        });
    });
});
