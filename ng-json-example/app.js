var app = angular.module('angularjs-starter', ['jsonService']);

app.controller('MainCtrl', function($scope, JsonService) {
  JsonService.get(function(data){
//TODO update data.json 
// var idea = {}; //emty idea object 
// var ideas = []; // emty array of ideas 	
//	 console.log(data[0].id),
//	console.log(data[0].frag)

window.oneIdeaJson = {
	"id": "12345678",
	"tile": "ideaTitle",
	"registered": true,
	"frags": [
		{"src": "httpvideosource","type": "video"},
		{"src": "httpimgsource", "type": "img"},
		{"src": "httpaudiosource","type": "audio"},
		{"src": "httptxtsource","type": "txt"},
		{"src": "someanotherhttpvideosource","type": "video"}
	]
};


  // testing 	
//  $scope.jsontest = window.oneIdeaJson.frags[2].src;
 // console.log($scope.jsontest);



//$scope.jd = data.ideas[1].id;   
 $scope.jd = data.ideas[2].frags[1].src;
console.log($scope.jd);

//TODO make a multi idea json with paging functionality too

  });
});
