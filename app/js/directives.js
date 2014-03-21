'use strict';

/* Directives */


angular.module('listingsApp.directives', [])

//Is this map loading every time we navigate back to page 1?
//Or does it load once, and send ajax calls to update itself?

.directive('bingMap', function () {  //NOTE, at compilation angular takes directive names, and turns them into lowercase with dashes(bing-map)
	return {
        restrict: 'A',
        scope:{model:'=ngModel'},
        link: function (scope, element, attrs) {    //link method runs every time the model changes
        	console.log('link method fired');
        	var map = new Microsoft.Maps.Map(element[0], {  //This is how to get the jquery wrapped DOM element (element[0]). Or this: document.getElementById('mapDiv')  
				credentials: 'AovYQxZWSSzeyfaYsu0pXyZss-AUNbR9NS26JIJXgd-PGjozm7qf_c9tVbBEM_8x',
				center: new Microsoft.Maps.Location(44.50865488,-69.09144155),
				mapTypeId: Microsoft.Maps.MapTypeId.road,
				zoom: scope.model.zoom
        	});
        	scope.$watchCollection('model', function(bingmap) {
				console.log('$watch model fired');
				
				if(bingmap.listings){
					var latlongs=new Microsoft.Maps.EntityCollection();
					for(var i=0; i<bingmap.listings.length; i++){
						latlongs.push(new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(bingmap.listings[i].Latitude, bingmap.listings[i].Longitude)));
					}
					if(map.latlongs){map.latlongs.clear();}
					map.entities.push(latlongs);	      		
				}             
			});  
        }
      };
});

//attrs.$observe('mapOptions',function(){});

//.directive('passObject', function() {
//    return {
//        restrict: 'E',
//        scope: { options: '=' },
//        template: '<div>Hello, {{options.prop}}!</div>'
//    };
//});



////  directive('appVersion', ['version', function(version) {
////    return function(scope, elm, attrs) {
////      elm.text(version);
////    };
// 
//.directive('ngPhotoThumbs', [function() {
//	return {
//	    restrict: 'A',
//	    require: '^ngModel',
//	    template: '<div class="sparkline"></div>'
//	  };
//	
//	

 

//<div ngPhotoThumbs ng-model="listing"></div>



// In Angular, you can call your directive in several different ways. 
// You can call it by using an element, an attribute, a class or as a comment. 
// The following are all valid ways to call a directive:
//
//	    <gravatar-image data-email="email></gravatar-image>
//	    <div gravatar-image="email"></div>
//	    <div class="gravatar-image: email"></div>

//there are four different ways to invoke a directive, so there are four valid options for restrict:
//
//	'A' - <span ng-sparkline></span> 
//	'E' - <ng-sparkline></ng-sparkline> 
//	'C' - <span class="ng-sparkline"></span> 
//	'M' - <!-- directive: ng-sparkline -->

//Notice, in the require option, we prefixed the controller with a ^. 
//AngularJS gives you two options in the require option about how to declare requirements with a prefixed character:
//
//	^ -- Look for the controller on parent elements, not just on the local scope 
//	? -- Don't raise an error if the controller isn't found