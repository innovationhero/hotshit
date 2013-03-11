var app = angular.module("points", []);

app.controller("PointsCtrl", function($scope,$timeout){
	// note that award winning must be served from the server before updated to the UI to prevent expolits via js from the client side
	$scope.points = 99; // calculated points fro server (OnlinePoints - OfflinePoints)
	$scope.awardPoints = function(){
		$scope.points++;
		console.log("$scope.awardPoints");
		awardtimeout =  $timeout($scope.awardPoints, 100);
	};

	$scope.removePoints = function(){

		$scope.points--;
		console.log("$scope.removePoints");
		removetimeout = $timeout($scope.removePoints,1000);
	};

	$scope.awardfewPoints = function(){
		$scope.points += 100000000000000;
	};

// 	var awardtimeout = $timeout($scope.awardPoints, 1000); 
//	var removetimeout = $timeout($scope.removePoints, 1000); // should only be used if i want to use the stop functionality which i dont need again!
/*
	$scope.stop = function(){
	if ($timeout.cancel(removetimeout)){console.log("cancelled removetimeout")} else if 
		($timeout.cancel(awardtimeout)){ console.log("cancelled awardtimeout")} else { console.log("nothing stopped")}
 	}; */

});
