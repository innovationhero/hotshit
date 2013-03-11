var app = angular.module("points", []);

app.controller("PointsCtrl", function($scope,$timeout){
  
	$scope.points = 99; // calculated points fro server (OnlinePoints - OfflinePoints)
	$scope.awardPoints = function(){
		$scope.points++;
		awardtimeout =  $timeout($scope.awardPoints, 1000);
	};

	var awardtimeout = $timeout($scope.awardPoints,1000);
	$scope.stop = function(){
         $timeout.cancel(awardtimeout);
 	}; 
  
	$scope.removePoints = function(){
		$scope.points--;
		mytimeout = $timeout($scope.removePoints,1000);
	};
});
