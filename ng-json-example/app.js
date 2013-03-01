var app = angular.module('angularjs-starter', ['jsonService']);

app.controller('MainCtrl', function($scope, JsonService) {
  JsonService.get(function(data){
    $scope.name = data.name;
    $scope.children = data.children;
  });
});