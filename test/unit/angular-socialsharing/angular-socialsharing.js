'use strict';

// Set the jasmine fixture path
// jasmine.getFixtures().fixturesPath = 'base/';

describe('socialsharing', function() {

    var module;
    var dependencies;
    dependencies = [];

    var hasModule = function(module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function() {

        // Get module
        module = angular.module('socialsharing');
        dependencies = module.requires;
    });

    it('should load config module', function() {
        expect(hasModule('socialsharing.config')).toBeTruthy();
    });
    
    it('should load services module', function() {
        expect(hasModule('socialsharing.services')).toBeTruthy();
    });
    

});
