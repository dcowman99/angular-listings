'use strict';

/* Filters */

angular.module('listingsApp.filters', [])

.filter('navbar', ['$routeParams' ,function($routeParams) {
	 return function(input) {
		//var page = $routeParams;
		console.log($routeParams);
		 if(input==currpage){
			return "active";	}
			 	
		 };
		 return '';
}]);


//  filter('interpolate', ['version', function(version) {
//    return function(text) {
//      return String(text).replace(/\%VERSION\%/mg, version);
//    };
//  }]);


//angular.module('listingsApp.directives', [])
////directive('appVersion', ['version', function(version) {
////return function(scope, elm, attrs) {
////elm.text(version);
////};
//
//.directive('ngPhotoThumbs', [function() {
//return {
//  restrict: 'A',
//  require: '^ngModel',
//  template: '<div class="sparkline"></div>'
//};
//
//
//}]);