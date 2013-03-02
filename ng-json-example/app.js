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
	"frags": {
		"frag": {"src": "httpvideosource","type": "video"},
		"frag": {"src": "httpimgsource", "type": "img"},
		"frag": {"src": "httpaudiosource","type": "audio"},
		"frag": {"src": "httptxtsource","type": "txt"}
	} 
};



  $scope.jsontest = window.oneIdeaJson.frags.frag.src;

   console.log($scope.jsontest);


//TODO make a multi idea json with paging functionality too

// var idea = cope.resource = new myResource(window.somePreloadedJson);

// src =  myIdea.["frags"].["frag"].["src"]

  });
});
