var app = angular.module('angularjs-starter', ['jsonService']);

app.controller('MainCtrl', function($scope, JsonService) {
  JsonService.get(function(data){
   // for each on the data object to store diff ideas
    $scope.name = data.name;
    $scope.children = data.children;
  });
});
