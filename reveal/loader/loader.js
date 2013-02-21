
var loader = angular.module("loader", [])

loader.directive('loadingbar', function(){
  return{
  restrict: 'E',
      replace: true,
      template: '<div id="fountainG">' +
       '<div class="fountainG" id="fountainG_1"></div>' +
  '<div class="fountainG" id="fountainG_2"></div>' +
  '<div class="fountainG" id="fountainG_3"></div>' +
  '<div class="fountainG" id="fountainG_4"></div>' +
  '<div class="fountainG" id="fountainG_5"></div>' +
  '<div class="fountainG" id="fountainG_6"></div>' +
  '<div class="fountainG" id="fountainG_7"></div>' +
  '<div class="fountainG" id="fountainG_8"></div>' + '</div>',
  };
});
