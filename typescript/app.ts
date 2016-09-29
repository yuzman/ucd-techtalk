/// <reference path="index_controller.ts"/>
declare var io;
declare var angular;

module UCD
{
    angular.module('UCD',
		['ngRoute',
		'ui.bootstrap',
		'UCD.Controllers']).config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider)
		{
			$routeProvider.when('/',
			{
				templateUrl: 'views/index.html',
				controller: UCD.Controllers.IndexController,
				controllerAs: 'vm'
			})
			.otherwise({
				redirectTo: '/'
			});
		}]).run(null);
	angular.module('UCD').constant('socket', io());
}