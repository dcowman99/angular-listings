'use strict';


// Declare App-level module with its dependencies
angular.module('listingsApp', [
  'ngRoute',
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap',
  'vr.directives.slider',
  'listingsApp.services',
  'listingsApp.controllers',
  'listingsApp.directives'
])

// Declare client-side routing for single-page-app
.config(['$routeProvider', '$locationProvider',	function($routeProvider, $locationProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'Ctrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'Ctrl2'});
  $routeProvider.when('/view5/:id', {templateUrl: 'partials/detail.html', controller: 'Ctrl5'});
  $routeProvider.when('/view3', {templateUrl: 'partials/partial3.html', controller: 'Ctrl3'});
  $routeProvider.when('/view4', {templateUrl: 'partials/partial4.html', controller: 'Ctrl4'});
  $routeProvider.when('/', {templateUrl: 'partials/partial1.html', controller: 'Ctrl1'});
  $routeProvider.otherwise({redirectTo: '/view1'});
  $locationProvider.hashPrefix('!');
}])

//------ Custom configuration to enable Form-encoded posts instead of application/json in the querystring
//-------------------------------------------------------------------------------------------------------
.config(['$httpProvider', function($httpProvider) { 
	//Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function(data)
	{
	   // The workhorse; converts an object to x-www-form-urlencoded serialization.
	   // @param {Object} obj
	   // @return {String}
	  var param = function(obj)
	  {
	    var query = '';
	    var value, fullSubName, subValue, innerObj, i;
	    for(var name in obj)
	    {
	      value = obj[name];  
	      if(value instanceof Array)
	      {
	        for(i=0; i<value.length; ++i)
	        {
	          subValue = value[i];
	          fullSubName = name + '[' + i + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value instanceof Object)
	      {
	        for(var subName in value)
	        {
	          subValue = value[subName];
	          fullSubName = name + '[' + subName + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value !== undefined && value !== null)
	      {
	        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	      }
	    }
	    return query.length ? query.substr(0, query.length - 1) : query;
	  };
	  return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];

}]);



//.config(['$httpProvider', function($httpProvider) {  
////configure this app to enable cross-domain requests (CORS)
//    $httpProvider.defaults.useXDomain = true;
//    delete $httpProvider.defaults.headers.common['X-Requested-With'];
//}
//]);








