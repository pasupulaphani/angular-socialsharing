'use strict';

describe("ssUtils", function() {

    beforeEach(module("socialsharing"));

    var service;

    beforeEach(inject(function(ssUtils) {
        service = ssUtils;
    }));

    describe("encode API to match specs", function() {
        
        //encodes a dictionary of values into a URL-encoded format
        it("should contain method encode", function() {
            expect(service.encode).toBeDefined();
        });


        describe("encode {} to url params", function() {
            it("should return an empty string", function() {
                var params = {};
                expect(service.encode(params)).toEqual('');
            });
        });

        describe("encode {a:null} to url params", function() {
            it("should return an empty string", function() {
                var params = {
                    a: null
                };
                expect(service.encode(params)).toEqual('');
            });
        });

        describe("encode {a:[]} to url params", function() {
            it("should return an empty string", function() {
                var params = {
                    a: []
                };
                expect(service.encode(params)).toEqual('');
            });
        });

        describe("encode {a:{}} to url params", function() {
            it("should return an empty string", function() {
                var params = {
                    a: {}
                };
                expect(service.encode(params)).toEqual('');
            });
        });

        describe("encode {a:undefined} to url params", function() {
            it("should return 'a=undefined' string", function() {
                var params = {
                    a: undefined
                };
                expect(service.encode(params)).toEqual('a=undefined');
            });
        });

        describe("encode {a:1} to url params", function() {
            it("should return 'a=1' string", function() {
                var params = {
                    a: 1
                };
                expect(service.encode(params)).toEqual('a=1');
            });
        });

        describe("encode {a:1, b:2} to url params", function() {
            it("should return an encoded string", function() {
                var params = {
                    a: 1,
                    b: 2
                };
                expect(service.encode(params)).toEqual('a=1&b=2');
            });
        });

        describe("encode {a:[1,2]} to url params", function() {
            it("should return an encoded string", function() {
                var params = {
                    a: [1, 2]
                };
                expect(service.encode(params)).toEqual('a=1&a=2');
            });
        });

        describe("encode {a:{b:1}} to url params", function() {
            it("should return a=1 string", function() {
                var params = {
                    a: {
                        b: 1
                    }
                };
                expect(service.encode(params)).toEqual('a=1');
            });
        });

        // out of scope, unhandled
        describe("encode {a:{b:c{1}}} to url params", function() {
            it("should return object ref string - unhandled", function() {
                var params = {
                    a: {
                        b: {
                            c: 1
                        }
                    }
                };
                expect(service.encode(params)).toEqual('a=%5Bobject%20Object%5D');
            });
        });
    });

    describe("encode API to match specs", function() {
        it("should contain method shortenURL", function() {
            expect(service.shortenURL).toBeDefined();
        });
    });
});
