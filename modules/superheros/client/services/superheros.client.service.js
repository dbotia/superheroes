// Superheros service used to communicate Superheros REST endpoints
(function () {
  'use strict';

  angular
    .module('superheros')
    .factory('SuperherosService', SuperherosService);

  SuperherosService.$inject = ['$resource'];

  function SuperherosService($resource) {
    return $resource('api/superheros/:superheroId', {
      superheroId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
