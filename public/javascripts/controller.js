var App = angular.module('App', ['angularSmoothscroll','ngAnimate', 'ngTouch'], function($locationProvider)
{
	$locationProvider.html5Mode(true);
});

App.controller('EventControl', function($scope, $sce, $http, $location) {

	$http.get('./javascripts/events.json')
		.then(function(res){
			var data = res.data;

			var eventName = $location.search().event;

			data.events.forEach(function(obj){
				if(obj.name == eventName){
					eventData = obj;
				}
			});

			$scope.ev = eventData;
			
			$scope.bullets = eventData.bullets;
			$scope.costs = eventData.costs;
			$scope.users = eventData.attendees;
			$scope.schedules = eventData.schedule;
			$scope.option1 = eventData.option1;
			$scope.option2 = eventData.option2;
            $scope.photos = eventData.gallery;
			$scope.mapURL = $sce.trustAsResourceUrl(eventData.gmap);
		});
        $scope.myInterval = 3000;

    
    'use strict';

    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };

    // show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };
});

App.controller('IndexControl', function($scope, $http){

	$http.get('./javascripts/events.json')
		.then(function(res){
				$scope.events = res.data.events;
			});

});

App.directive('backgroundImageDirective', ['$location', function (location) {
    return function (scope, element, attrs) {
    	var eventName = location.search().event;
        element.css({
            'background-image': 'url(images/backgrounds/' + eventName + '_banner.jpg)',
            'background-repeat': 'no-repeat',
            'background-align': 'center',
            'background-size': 'cover'
        });
    };
}]);
