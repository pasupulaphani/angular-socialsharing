'use strict';

describe("$fb", function() {

    var provider, service;
    beforeEach(module("socialsharing", function($fbProvider) {
        provider = $fbProvider;

        describe("$fbProvider", function() {
            it("should contain method setConfig", function() {
                expect(provider.init).toBeDefined();
            });
        });

        // initialize
        provider.init(84804589457);
    }));

    beforeEach(inject(function($fb) {
        service = $fb;
    }));

    describe("API to match specs:", function() {
        it("should contain method intent", function() {
            expect(service.feed).toBeDefined();
        });
    });

});
