'use strict';

/* Services */
//Services are singletons, and exist for application lifetime.
//They are cached, stay alive between page navigation and are available from anywhere.

angular.module('listingsApp.services', ['ngResource'])

.factory('ListingSearch', ['$resource', '$http', function($resource, $http) {
	return {
		//Use $resource to hit REST-enabled endpoints
		//CORS: Cross Origin Request Sharing for x-domain requests
		corsSearch: function(searchParams){
			return $resource('http://localhost:3000/cors/listings',
					{callback:'JSON_CALLBACK'}, 
					{save: {method:'POST', params:searchParams, isArray:true}});
		},
		//Use raw $http to post complex search objects using form-encoding
		postSearch: function() {
			return $http.post("http://localhost:3000/cors/listings", this.searchParams, {
		        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				, isArray:true
			    })
			    .then(function(result){ return result.data; });
		},
		postCount: function() {
			return $http.post("http://localhost:3000/cors/listingCount", this.searchParams, {
		        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				//, isArray:true
			    })
			    .then(function(result){ return result.data; });
		},
		postListingDetail: function(listingId) {
			return $http.post("http://localhost:3000/cors/listing", {id:listingId}, {
		        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				//, isArray:true
			    })
			    .then(function(result){ return result.data; });
		},
		//Jsonp: another option for x-domain requests
		jsonpListing: function(listingId){ 
			return $resource('http://localhost:3000/jsonp/listing/:id',  {callback:'JSON_CALLBACK'}, 
					{query:{method:'JSONP', params: {id:listingId}}
			});
		},
		
		//Define objects that will be injected into any controller that uses this service
		searchParams: {
			 criteria:{ListingPrice: {$gte:40000, $lte:5000000 }},  
			 pgsize: 10,
			 pgnum: 1,
			 sort: '-ListingPrice'
		 },
		 listings:{},
		 listingCount:0,

		resetCount: function(){this.listingCount = 1;},
		resetPageSize: function(){this.searchParams.pgsize = 20;}, 
		resetPaging: function(){this.searchParams.pgnum = 1;}
	};
}])
.factory('BingMapService', [ function() {
	return {
		maps:{},
		map_id:'#mapDiv',
		credentials:'AovYQxZWSSzeyfaYsu0pXyZss-AUNbR9NS26JIJXgd-PGjozm7qf_c9tVbBEM_8x',
		lat:44.50865488,
		lng:-69.09144155,
		zoom:8,	
		
		addMap:function() {
			console.log('addMap');
		    this.maps['#mapDiv'] = initialize(this.map_id, this.credentials, this.lat, this.lng, this.zoom);
		  },
		getMap:function() {
			console.log('getMap');
		    if (!this.maps['#mapDiv']) this.addMap('#mapDiv');
		    return this.maps['#mapDiv'];
		  }

	};
}])
.value('version', '0.1');
		
function initialize(map_id, cred, lat, lng, zoom) {
	console.log('map.initialize');
	  var myOptions = {
			  credentials: cred,
			  center: new Microsoft.Maps.Location(lat,lng),
			  mapTypeId: Microsoft.Maps.MapTypeId.road,
			  zoom:zoom
	  };
	  return new Microsoft.Maps.Map($(map_id)[0], myOptions);
}
		

//.factory('ListingSearch', ['$resource', function($resource) {
//	return function(searchParams){
//		return $resource('http://localhost:3000/jsonp/listall2', {callback:'JSON_CALLBACK'}, 
//				{query: {method:'JSONP', 
//				 params:searchParams, 
//					 isArray:true}
//		});
//	};
//}])

	




















