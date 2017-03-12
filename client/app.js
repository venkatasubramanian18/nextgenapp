var myApp = angular.module('myApp',['ngRoute']);

myApp.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'views/quote.html'
	})
	.when('/personal_details', {
		templateUrl: 'views/personal_details.html'
	})
	.when('/driver_details', {
		templateUrl: 'views/driver_details.html'
	})
	.when('/veh_details', {
		templateUrl: 'views/veh_details.html'
	})
	.when('/cov_details', {
		templateUrl: 'views/coverage_details.html'
	})
	.when('/summary', {
		templateUrl: 'views/summary.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});