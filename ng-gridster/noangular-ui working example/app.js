var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope) {
  $scope.widgets = [
    {id:"first", text:'Widget #1', row:1, col:1, sizex:2, sizey:2},
    {text:'Widget #2', row:2, col:1, sizex:1, sizey:1},
    {text:'Widget #3', row:1, col:2, sizex:1, sizey:1},
    {text:'Widget #4', row:2, col:2, sizex:1, sizey:1}
  ];

  $scope.addWidget = function() {
	// randomSize X & Y are actually the GAlgorithm evolution rating to define size based on fitness and black beautiful asses
    var randomSizex = Math.floor(Math.random()*2) + 1;
    var randomSizey = Math.floor(Math.random()*2) + 1;
    $scope.widgets.push({text:'Widget #'+"haha", row:5, col:2, sizex:randomSizex, sizey:randomSizey});

   // $scope.widgets.push({text:'Widget #'+($scope.widgets.length+1), row:3, col:1, sizex:randomSizex, sizey:randomSizey});
  };
	
  $scope.resizeWidget = function() {
	//takes a widget as pramater passed in 
//	$scope.widgets[0].resize_widget(this, 8,8);
	$scope.widgets[0].sizex = 20;
// .resize_widget( $widget, [size_x], [size_y] )
 
	}
  $scope.combineWidget = function() {
	// takes 2 widgets as paramater
	$scope.widgets
	}
});
