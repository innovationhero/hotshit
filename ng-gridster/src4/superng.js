/* 
                  _____   _                              __   _              __                
                 / ___ \ (_)___   ___  ___  _  __ ___ _ / /_ (_)___   ___   / /  ___  ____ ___ 
                / / _ `// // _ \ / _ \/ _ \| |/ // _ `// __// // _ \ / _ \ / _ \/ -_)/ __// _ \
                \ \_,_//_//_//_//_//_/\___/|___/ \_,_/ \__//_/ \___//_//_//_//_/\__//_/   \___/
                 \___/                                                                         

  
                                 _   _._|_|_|_|_ o._ (~|  o _   _ ._   o _| _ _ |
                                }_\/}_|  _| | | ||| | _|  |_\  (_|| |  |(_|}_(_|o
*/ 
var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope, $timeout){
  $scope.widgets = [
    {fitness:5, text:'Widget #1', row:1, col:1, sizex:1, sizey:1},
    {fitness:4, text:'Widget #2', row:2, col:1, sizex:1, sizey:2},
    {fitness:3, text:'Widget #3', row:1, col:2, sizex:3, sizey:3},
    {fitness:2, text:'Widget #4', row:3, col:5, sizex:1, sizey:1},
    {fitness:1, text:'Widget #5', row:1, col:5, sizex:1, sizey:2}
  ];



