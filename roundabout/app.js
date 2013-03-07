var app = angular.module('ekoki',
 ['ekoki.jsonService', 'ui']);



app.controller('MainCtrl', function($scope, JsonService) {
  JsonService.get(function(data){

var fin = data.ideas.length; //fetchedIdeasNumber = fin
var iC = [] // ideaCollection is iC

while (fin--) {
console.log("the number of the fetched idea " + fin);
console.log(data.ideas[fin].title);
iC.push(data.ideas[fin]);
console.log("idea collection length ya prince " + iC.length);
} 

$scope.iC = iC;
//$scope.frags = iC.frags;
console.log("idea collection length ya prince " + iC.length);
 
console.log("idea collection length ya prince " + iC[1].frags[0].type); //for each in frags show in the html page through the $scope 
//TODO make a multi idea json with paging functionality too, it must be a Ruby Server-side pagination to allow genetics being performed on the client side before genetic cycling     



  });
});

// GridsterCtrl
// var myApp = angular.module("myApp", ["ui"]);
app.controller("GridsterCtrl", function ($scope) {
    $scope.items = [{
        value: "first",
        col: 1,
        row: 1
    }, {
        value: "http://www.youtube.com/embed/nUonwNnj8Eo",
        col: 2,
        row: 1
    }, {
        value: 'third',
        col: 1,
        row: 2
    }];
});
// end of GridsterCtrl




// ekoki.directive.reveal
// ekoki.directive.roundabout
// rb = roundabout
/*angular.module("ekoki.rbDirective", []).directive('roundaboutideas', function(){
  return{
  restrict: 'E',
      replace: true,
      template: '<div ng-repeat="idea in iC">' +
		'<ul ng-repeat="frag in idea.frags">' +		 		'<li>	the fragement {{frag.src}} </li>'+			'</ul>'+
		'</div>',
  };
}); 
*/

