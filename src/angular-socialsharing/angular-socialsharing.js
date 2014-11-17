// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('angular-socialsharing.config', [])
    .value('angular-socialsharing.config', {
        debug: true
    });

// Modules
angular.module('angular-socialsharing.services', []);
angular.module('angular-socialsharing',
    [
        'angular-socialsharing.config',
        'angular-socialsharing.services'
    ]);
