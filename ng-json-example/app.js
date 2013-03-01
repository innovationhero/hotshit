var app = angular.module('angularjs-starter', ['jsonService']);

app.controller('MainCtrl', function($scope, JsonService) {
  JsonService.get(function(data){
   // for each on the data object to store diff ideas
   // for idea in data do
 	
   // $scope.name = data.name;
   // $scope.children = data.children;
    $scope.data = data; 	
    angular.forEach(data.idea){
	$scope.id = idea.id;
	$scope.frag = idea.frag;
	};

  });
});
