// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('yourLibrary.config', [])
    .value('yourLibrary.config', {
        debug: true
    });

// Modules
angular.module('yourLibrary.directives', []);
angular.module('yourLibrary.filters', []);
angular.module('yourLibrary.services', []);
angular.module('yourLibrary',
    [
        'yourLibrary.config',
        'yourLibrary.directives',
        'yourLibrary.filters',
        'yourLibrary.services',
        'ngResource',
        'ngCookies',
        'ngSanitize'
    ]);
