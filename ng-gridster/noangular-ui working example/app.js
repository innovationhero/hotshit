var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope) {
  $scope.widgets = [
    {text:'Widget #1', row:1, col:1, sizex:5, sizey:1},
    {text:'Widget #2', row:2, col:1, sizex:1, sizey:1},
    {text:'Widget #3', row:1, col:2, sizex:1, sizey:1},
    {text:'Widget #4', row:2, col:2, sizex:1, sizey:1}
  ];

  $scope.addWidget = function() {
    var randomSizex = 2//Math.floor(Math.random()*2) + 1;
    var randomSizey = 2//Math.floor(Math.random()*2) + 1;
    $scope.widgets.push({text:'Widget #'+"haha", row:5, col:2, sizex:randomSizex, sizey:randomSizey});
   // $scope.widgets.push({text:'Widget #'+($scope.widgets.length+1), row:3, col:1, sizex:randomSizex, sizey:randomSizey});
  };
});
