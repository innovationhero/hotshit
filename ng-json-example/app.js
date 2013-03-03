var app = angular.module('angularjs-starter', ['jsonService']);

app.controller('MainCtrl', function($scope, JsonService) {
  JsonService.get(function(data){
//TODO update data.json 
// var idea = {}; //emty idea object 
// var ideas = []; // emty array of ideas 	
//	 console.log(data[0].id),
//	console.log(data[0].frag)
	
  // testing 	
//  $scope.jsontest = window.oneIdeaJson.frags[2].src;
 // console.log($scope.jsontest);



//$scope.jd = data.ideas[1].id;   
// $scope.jd = data.ideas[2].frags[1].src;
//$scope.jd = data.ideas.length; // the length of the json ideas array to be used for looping
// console.log($scope.jd);

var fin = data.ideas.length; //fetchedIdeasNumber = fin
var iC = [] // ideaCollection is iC

while (fin--) {
console.log("the number of the fetched idea " + fin);
console.log(data.ideas[fin].title);
iC.push(data.ideas[fin]);
console.log("idea collection length ya prince " + iC.length);
} 

$scope.iC = iC;
$scope.frags = iC.frags;
console.log("idea collection length ya prince " + iC.length);
 
console.log("idea collection length ya prince " + iC[1].frags[0].type); //for each in frags show in the html page through the $scope 
//TODO make a multi idea json with paging functionality too, it must be a Ruby Server-side pagination to allow genetics being performed on the client side before genetic cycling     



  });
});
