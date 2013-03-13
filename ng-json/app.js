var app = angular.module('angularjs-starter', ['jsonService']);

angular.module('jsonService', ['ngResource']) 
.factory('JsonService', function($resource) {
  return $resource('data.json').then( function ( response ) {
  $scope.log.push( { msg: 'Data Received!' } );
	});
});

app.controller('MainCtrl', function($scope, JsonService) {
  JsonService.get(function(data){

  });
});
