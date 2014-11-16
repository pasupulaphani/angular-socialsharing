'use strict';

// Set the jasmine fixture path
// jasmine.getFixtures().fixturesPath = 'base/';

describe('yourLibrary', function() {

    var module;
    var dependencies;
    dependencies = [];

    var hasModule = function(module) {
        return dependencies.indexOf(module) >= 0;
    };

    beforeEach(function() {

        // Get module
        module = angular.module('yourLibrary');
        dependencies = module.requires;
    });

    it('should load config module', function() {
        expect(hasModule('yourLibrary.config')).toBeTruthy();
    });

    
    it('should load filters module', function() {
        expect(hasModule('yourLibrary.filters')).toBeTruthy();
    });
    

    
    it('should load directives module', function() {
        expect(hasModule('yourLibrary.directives')).toBeTruthy();
    });
    

    
    it('should load services module', function() {
        expect(hasModule('yourLibrary.services')).toBeTruthy();
    });
    

});
