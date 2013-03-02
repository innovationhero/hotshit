var app = angular.module('angularjs-starter', ['jsonService']);

app.controller('MainCtrl', function($scope, JsonService) {
  JsonService.get(function(data){

// var idea = {}; //emty idea object 
// var ideas = []; // emty array of ideas 
	
	 console.log(data[0].id),
	console.log(data[0].frag)


// Idea to be posted
myIdea = {
	"id": ideaID,
	"tile": "ideaTitle",
	"registered": true,
	"frags": {
		"frag": {"src": "httpvideosource","type": "video"},
		"frag": {"src": "httpimgsource", "type": "img"},
		"frag": {"src": "audiosource","type": "audio"},
		"frag": {"src": "txtsource","type": "txt"}
	} 
}
// myIdea.["frag"].video

  });
});
