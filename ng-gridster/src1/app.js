/* 
		  _____   _                              __   _              __                
		 / ___ \ (_)___   ___  ___  _  __ ___ _ / /_ (_)___   ___   / /  ___  ____ ___ 
		/ / _ `// // _ \ / _ \/ _ \| |/ // _ `// __// // _ \ / _ \ / _ \/ -_)/ __// _ \
		\ \_,_//_//_//_//_//_/\___/|___/ \_,_/ \__//_/ \___//_//_//_//_/\__//_/   \___/
		 \___/                                                                         


				 _   _._|_|_|_|_ o._ (~|  o _   _ ._   o _| _ _ |
				}_\/}_|  _| | | ||| | _|  |_\  (_|| |  |(_|}_(_|o
*/

/* 
how come the geek got lost while he was trying to visit his geeky friend at his place????

coz when he called his geeky friend to ask for directions he replied "use the force luke" and hangup and refused to pickup again waiting......
*/

var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope, $timeout){
  $scope.widgets = [
    {fitness:5, text:'Widget #1', row:1, col:1, sizex:1, sizey:1},
    {fitness:4, text:'Widget #2', row:2, col:1, sizex:1, sizey:2},
    {fitness:3, text:'Widget #3', row:1, col:2, sizex:3, sizey:3},
    {fitness:2, text:'Widget #4', row:3, col:5, sizex:1, sizey:1},
    {fitness:1, text:'Widget #5', row:1, col:5, sizex:1, sizey:2}
  ];

 
/////////////////////////////////////////////////////////
  $scope.addWidget = function() {
	// randomSize X & Y are actually the GAlgorithm evolution rating to define size based on fitness and black beautiful asses
    var randomSizex = Math.floor(Math.random()*2) + 1;
    var randomSizey = Math.floor(Math.random()*2) + 1;
    $scope.widgets.push({text:'Widget #', row:5, col:2, sizex:randomSizex, sizey:randomSizey});

   // $scope.widgets.push({text:'Widget #'+($scope.widgets.length+1), row:3, col:1, sizex:randomSizex, sizey:randomSizey});
  };

////////////////////////////////////////////////////////
 $scope.rearrange  = function(){
// this function is meant to rearragne the widgets based on its fitness value
 $scope.widgets[2].row = 1;
$scope.widgets[2].col = 1;
$scope.widgets[2].text = "Rearrangement Sir!";
 };


$scope.scramble = function($watch){
var bitch = $scope.widgets;
//$scope.widgets.sort(function() {return 0.5 - Math.random()}) //Array elements now scrambled

bitch.sort(function(a,b){return b - a});
bitch.forEach(function(entry) {
entry.row++;
entry.col++;
entry.sizex++;
entry.fitness++;
    console.log(entry.fitness);
});   

$scope.widgets = bitch; 
$scope.$apply();
//console.log($scope.widgets[0].text + "The Fitness " + $scope.widgets[0].fitness);
}


 $timeout(function(){
	$scope.widgets[0].sizex++;
//$scope.$apply(gridster.resize_widget($scope.widgets[0], 4,4));	
$scope.$apply();
 }, 4000);



 $scope.onTimeout = function(){
       //  $scope.counter++;
 console.log($scope.widgets[0].length); 
 $scope.widgets[0].sizex++;
        mytimeout = $timeout($scope.onTimeout,1000);
    };
	
/////////////////////////////////////////////////////////
  $scope.resizeWidget = function(){
//takes a widget as pramater passed in 
//	$scope.widgets[0].resize_widget(this, 8,8);

 $scope.widgets[0].sizex++;
 
// $scope.$apply();
// angular.element(this).scope().$apply();
// $scope.$apply();
// $scope.widgets[0] =  $scope.widgets.push({text:'Widget #', row:1, col:1, sizex:2, sizey: 2});


//x = x + 1; 
//	$scope.widgets[0] =  { sizex:2, sizey:2};
// .resize_widget( $widget, [size_x], [size_y] )
};

/////////////////////////////////////////////////////////
  $scope.combineWidget = function() {
	// takes 2 widgets as paramater
	$scope.widgets
  };
});
