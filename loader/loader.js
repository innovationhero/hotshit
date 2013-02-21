function loaderCtrl($scope) {
  $scope.number_of_loading_cubes = '3';
}


angular.module('loaderModule', [])
  .directive('theLoader', function(){
    return {
      restrict: 'E',
      // This HTML will replace theLoader directive.
      replace: true,
      transclude: true,
      scope: { number_of_loading_cubes:'@noofcubes' },
      template: '<div>' +
                  '<div class="number_of_loading_cubes">{{noofcubes}}</div>' +
                  '<div class="body" ng-transclude></div>' +
                '</div>',
      // The linking function will add behavior to the template
      link: function(scope, element, attrs) {
            // number_of_loading_cubes element
        var number_of_loading_cubes = angular.element(element.children()[0])
      }
    }
  });


/* This loader.js contains all the angular code needed, not divided among different files for similicity at this stage of learning */

//var myLoader = angular.module('loaderApp');

/* Ekoki Loader Angular Controller */
/*function loaderCtrl($scope) {

	function buildBox(){
	     color   : '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
		 x       : Math.min(380,Math.max(20,(Math.random() * 380))),
         y       : Math.min(180,Math.max(20,(Math.random() * 180)))
	}
    // Publish list of boxes on the $scope/presentationModel
    $scope.boxes   = [
    { "name": "Wake up" },
    { "name": "Brush teeth" },
    { "name": "Shower" },
    { "name": "Have breakfast" },
    { "name": "Go to work" },
    { "name": "Write a Nettuts article" },
    { "name": "Go to the gym" },
    { "name": "Meet friends" },
    { "name": "Go to bed" }
  ];


    // Create boxes
    for (i = 0; i < 9; i++) {
        $scope.boxes.push[i];
    }
}
*/


/* Ekoki Loader Angular Directive */

/*
myLoader.directive('loader', function(){
return {
    restrict: 'E',
        link:function (scope, element, attrs) {
            scope.$watch('box', function (val) {
                var changes = {
                    left:val.x + 'px',
                    top:val.y + 'px',
                    backgroundColor:val.color
                }
                element.css(changes);
            }, true);
        }
    };

});

*/








/*
<link rel='stylesheet'  href='loader.css' type='text/css' media='all' />
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.0.4/angular.min.js"></script>

<script src="loader.js"></script>

<div ng-app = "loaderApp" ng-controller = "loaderCtrl">


 <ul>
   <li ng-repeat = "box in boxes">
     {{box}}
   </li>
  </ul>

</div>

*/










 /* function buildBox () {
        return {

         position: 'absolute;',
         top: 0,
        // top:
        // background-color:
        // width:
        // height:

            color   : '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
            x       : Math.min(380,Math.max(20,(Math.random() * 380))),
            y       : Math.min(180,Math.max(20,(Math.random() * 180)))
        };
    }; */


 //   restrict: 'AE', /* now i can use <loader> instead of using <div loader /> so instead of attribute A, it is attribute and element E*/




// loaderAnimate finds the loaderCube
	// document.getElementById("MyElement").className = "MyClass";
	// then assign its special css value of transition injecting the regular css through the controller programatically
	// this means i can add a higher or lower no of loaderCubes depending on programming conditions.







/*/////////////////////// Extras & Refernces ////////////////////////////*/

/* var myModule = angular.module(...);
myModule.directive('directiveName', function factory(injectables) {
  var directiveDefinitionObject = {
    priority: 0,
    template: '<div></div>',
    templateUrl: 'directive.html',
    replace: false,
    transclude: false,
    restrict: 'A',
    scope: false,
    compile: function compile(tElement, tAttrs, transclude) {
      return {
        pre: function preLink(scope, iElement, iAttrs, controller) { ... },
        post: function postLink(scope, iElement, iAttrs, controller) { ... }
      }
    },
    link: function postLink(scope, iElement, iAttrs) { ... }
  };
  return directiveDefinitionObject;
}); */
