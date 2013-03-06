angular.module('ekoki.jsonService', ['ngResource'])
.factory('JsonService', function($resource) {
  return $resource('data.json');
});
