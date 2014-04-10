'use strict';

/* Controllers */
//New controller instance each time a view is called.
//Don't call one controller from another.  Shared functionality should go into a service.
angular.module('listingsApp.controllers', [])

//controller for main index page
.controller('ctrl-base', ['$scope', '$rootScope', '$http', 'ListingSearch', '$location', function($scope, $rootScope, $http, ListingSearch, $location){  
	$scope.$on('$locationChangeSuccess', function(event) {
		  console.log($location.path());   //url changed
		});

	$scope.isActive = function (view) { 
        return view === $location.path();  //Checks whether passed in view is the currently loaded view (for CSS active class)
    };
	
	  $('.dropdown-toggle').dropdown();  //Setup drop down menu
	  $('.dropdown input, .dropdown label, .dropdown select').click(function(e) {e.stopPropagation();});  //Prevent clicks on input items from closing the dropdown
	  
	  $scope.searchParams = ListingSearch.searchParams;
 	  //TODO: Pull in search criteria based on last listing on the current page
	  //TODO: Figure out why its re-running the search on back-button from detail page
	  
	  //--------------- Refactor this out -------------------------
	  $scope.getListings = function(getcount){
		  ListingSearch.postSearch().then(function(data){
			  ListingSearch.listings = data;
			  $rootScope.$emit('listingsChanged');
		  });
		  if(getcount || $scope.searchParams.pgnum == 1) {  //only fetch count on 1st request, or when criteria changes (not during paging)
			  ListingSearch.postCount().then(function(data){
				  ListingSearch.listingCount = data.result;
			  });
	  	  }
	  };
	//--------------- Refactor this out -------------------------
	  
	  $scope.search = function() {  
		  ListingSearch.resetPaging();
		  console.log('search from menu');
		  $scope.getListings(true);
	  }; 
}])

.controller('Ctrl1', ['$scope', '$rootScope', '$http', 'ListingSearch', function($scope, $rootScope, $http, ListingSearch) {
	console.log('Ctrl1 fired');
	$('#mapDiv').show();
}])

.controller('MapCtrl', ['$scope', '$rootScope', 'BingMapService', 'ListingSearch', function($scope, $rootScope, BingMapService, ListingSearch) {
	$scope.map = BingMapService.getMap();
	$scope.pinInfoBox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), {visible:false});
	$scope.infoboxLayer = new Microsoft.Maps.EntityCollection();
	$scope.pinLayer = new Microsoft.Maps.EntityCollection();
	
	$rootScope.$on('listingsChanged', function () {
		console.log('mapcontrol listingsChanged fired');
		console.log('$scope.pinLayer: '+$scope.pinLayer);
		if($scope.pinLayer){$scope.pinLayer.clear();}
		
		if(ListingSearch.listings){
			$scope.infoboxLayer.push($scope.pinInfoBox);
	        
			for(var i=0; i<ListingSearch.listings.length; i++){
				var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(ListingSearch.listings[i].Latitude, ListingSearch.listings[i].Longitude));
				//pin.Title = ListingSearch.listings[i].Address;
				pin.Description = '<div>'+ListingSearch.listings[i].Address+'</div><div>'+ListingSearch.listings[i].City+', '+ListingSearch.listings[i].Region+'</div><a href=\"#/view5/'+ListingSearch.listings[i]._id+'\"><img src=\"http:'+ListingSearch.listings[i].PhotoSourcePath+'HBMLG_'+ListingSearch.listings[i].MLSListingID+'.jpg\" class=\"map-img\" /></a>';
				
				Microsoft.Maps.Events.addHandler(pin, 'click', $scope.displayInfobox);
				Microsoft.Maps.Events.addHandler($scope.map, 'viewchange', $scope.hideInfobox);
				$scope.pinLayer.push(pin);
			}
			$scope.map.entities.push($scope.pinLayer);	  
			$scope.map.entities.push($scope.infoboxLayer);	
		}     
	}); 
	
	$scope.displayInfobox = function(e) {
		console.log('displayInfoBox: '+e);
		$scope.pinInfoBox.setOptions({title: e.target.Title, description:e.target.Description, visible:true, offset:new Microsoft.Maps.Point(0,25)});
		$scope.pinInfoBox.setLocation(e.target.getLocation());
    };

    $scope.hideInfobox = function(e) {
    	$scope.pinInfoBox.setOptions({visible:false});
    };	
}])


.controller('Ctrl2', ['$scope', '$rootScope', '$http', 'ListingSearch', function($scope, $rootScope, $http, ListingSearch) { 
	$('#mapDiv').hide();
	$scope.searchParams = ListingSearch.searchParams;
	$scope.letters=["", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll", "mm", "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz"];
	
	//http:{{item.PhotoSourcePath}}HBMLG_{{item.MLSListingID}}.jpg
	
	$rootScope.$on('listingsChanged', function () {
		console.log('Ctrl2:listingsChanged: ');
		$scope.listings = ListingSearch.listings;
		$scope.listingCount = ListingSearch.listingCount;
		$scope.searchParams = ListingSearch.searchParams;
    });
	
	//--------------- Refactor this out -------------------------
	  $scope.getListings = function(getcount){
		  ListingSearch.postSearch().then(function(data){
			  $scope.listings = data;
		  });
		  if(getcount || $scope.searchParams.pgnum == 1) {  //only fetch count on 1st request, or when criteria changes (not during paging)
			  ListingSearch.postCount().then(function(data){
				  $scope.listingCount = data.result;
			  });
	  	  };
	  };
	//--------------- Refactor this out -------------------------
	  
	  $scope.$watch('searchParams.pgnum', function(){  //paging
		  console.log('pagenum changed: '+ $scope.searchParams.pgnum);
		  $scope.getListings(false);
	  });

	  
  }])

.controller('Ctrl5', ['$scope', '$routeParams','ListingSearch', function($scope, $routeParams, ListingSearch) {
	
		ListingSearch.postListingDetail($routeParams.id).then(function(data){
			  $scope.listing = data;
			  console.log($scope.listing.Address);
		 
				if($scope.listing.PhotoAtHBM) {
				var letters=["", "a", "b", "c", "d", "e", "f",
				             "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w",
				             "x", "y", "z", "aa", "bb", "cc", "dd", "ee", "ff", "gg", "hh", "ii", "jj", "kk", "ll",
				             "mm", "nn", "oo", "pp", "qq", "rr", "ss", "tt", "uu", "vv", "ww", "xx", "yy", "zz"];
				$scope.thumbs=[];
				for (var i = 0; i <= $scope.listing.MultiplePhotoCount-1; i++) {
		            $scope.thumbs.push($scope.listing.PhotoSourcePath + $scope.listing.MLSListingID + letters[i] + '.jpg');
				}
			}
			$scope.mainImageUrl = 'http:'+$scope.listing.PhotoSourcePath+'HBMLG_'+$scope.listing.MLSListingID+'.jpg';
		
		
		});
		
//		
//		 $scope.setImage = function(imageUrl) {
//			 $scope.mainImageUrl = imageUrl;
//		 };

}])
.controller('Ctrl3', ['$scope', '$rootScope', '$http', 'ListingSearch', function($scope, $rootScope, $http, ListingSearch) { 
	$('#mapDiv').hide();
	$scope.searchParams = ListingSearch.searchParams;
	  
	$scope.getJsonpListings = function() {
		$scope.listings = ListingSearch.jsonpListings();
	};
	
	$scope.getOneListing = function(listingid) {
		$scope.listings = ListingSearch.getOneListing(listingid);
	};
	
}]);

function Ctrl7($scope) {
	$('#mapDiv').hide();
	  $scope.alerts = [
	    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
	    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
	  ];

	  $scope.addAlert = function() {$scope.alerts.push({msg: "Another alert!"});};
	  $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};
	  $scope.items = [
	                  "The first choice!",
	                  "And another choice for you.",
	                  "but wait! A third!"
	                ];
	  $scope.cost = 350;
	  
	  
}


var Ctrl4 = function ($scope) {
	$('#mapDiv').hide();
	  $scope.totalItems = 64;
	  $scope.currentPage = 4;
	  $scope.maxSize = 5;
	  
	  $scope.setPage = function (pageNo) {
	    $scope.currentPage = pageNo;
	  };

	  $scope.bigTotalItems = 175;
	  $scope.bigCurrentPage = 1;
	};

//$scope.listings = ListingSearch($scope.searchParams).save();		//way to run query & pass params
//$scope.listingCount = ListingSearch.jsonpCount($scope.searchParams).query();









