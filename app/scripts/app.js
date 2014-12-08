'use strict';

/**
 * @ngdoc overview
 * @name angApp
 * @description
 * # angApp
 *
 * Main module of the application.
 */
angular
    .module('angApp', [
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/getting-started', {
                templateUrl: 'views/getting-started.html',
                controller: 'MainCtrl'
            })
            .when('/demo', {
                templateUrl: 'views/demo.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function($rootScope, $location) {
        $rootScope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };
    });
