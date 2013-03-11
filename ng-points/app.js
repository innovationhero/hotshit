var app = angular.module("points", []);

app.controller("PointsCtrl", function($scope,$timeout){
	$scope.points = 99; // calculated points fro server (OnlinePoints - OfflinePoints)
	$scope.awardPoints = function(){
		$scope.points++;
		console.log("$scope.awardPoints");
		awardtimeout =  $timeout($scope.awardPoints, 1000);
	};

	$scope.removePoints = function(){

		$scope.points--;
		console.log("$scope.removePoints");
		removetimeout = $timeout($scope.removePoints,1000);
	};

// 	var awardtimeout = $timeout($scope.awardPoints, 1000); 
//	var removetimeout = $timeout($scope.removePoints, 1000); // should only be used if i want to use the stop functionality which i dont need again!
/*
	$scope.stop = function(){
	if ($timeout.cancel(removetimeout)){console.log("cancelled removetimeout")} else if 
		($timeout.cancel(awardtimeout)){ console.log("cancelled awardtimeout")} else { console.log("nothing stopped")}
 	}; */

});
