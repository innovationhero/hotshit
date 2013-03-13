var myApp = angular.module("myApp",["ui"]);

myApp.controller("MyCtrl", function($scope) {
  	$scope.items = [
      { value: "first", col: 1, row: 1 },
      { value: "second", col: 2, row: 1 },
      { value: "third", col: 1, row: 2 }
    ];
});
