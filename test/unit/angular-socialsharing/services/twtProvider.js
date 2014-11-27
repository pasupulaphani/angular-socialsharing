'use strict';

describe("$twt :", function() {

    var provider, service;
    beforeEach(module("socialsharing", function($twtProvider) {
        provider = $twtProvider;

        describe("$twtProvider", function() {
            it("should contain method setConfig", function() {
                expect(provider.setConfig).toBeDefined();
            });
        });
    }));

    beforeEach(inject(function($twt) {
        service = $twt;
    }));

    describe("API to match specs:", function() {
        it("should contain method intent", function() {
            expect(service.intent).toBeDefined();
        });
    });


});
