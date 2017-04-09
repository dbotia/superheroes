(function () {
  'use strict';

  angular
    .module('superheros')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('superheros', {
        abstract: true,
        url: '/superheros',
        template: '<ui-view/>'
      })
      .state('superheros.list', {
        url: '',
        templateUrl: 'modules/superheros/client/views/list-superheros.client.view.html',
        controller: 'SuperherosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Superheros List'
        }
      })
      .state('superheros.create', {
        url: '/create',
        templateUrl: 'modules/superheros/client/views/form-superhero.client.view.html',
        controller: 'SuperherosController',
        controllerAs: 'vm',
        resolve: {
          superheroResolve: newSuperhero
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Superheros Create'
        }
      })
      .state('superheros.edit', {
        url: '/:superheroId/edit',
        templateUrl: 'modules/superheros/client/views/form-superhero.client.view.html',
        controller: 'SuperherosController',
        controllerAs: 'vm',
        resolve: {
          superheroResolve: getSuperhero
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Superhero {{ superheroResolve.name }}'
        }
      })
      .state('superheros.view', {
        url: '/:superheroId',
        templateUrl: 'modules/superheros/client/views/view-superhero.client.view.html',
        controller: 'SuperherosController',
        controllerAs: 'vm',
        resolve: {
          superheroResolve: getSuperhero
        },
        data: {
          pageTitle: 'Superhero {{ superheroResolve.name }}'
        }
      });
  }

  getSuperhero.$inject = ['$stateParams', 'SuperherosService'];

  function getSuperhero($stateParams, SuperherosService) {
    return SuperherosService.get({
      superheroId: $stateParams.superheroId
    }).$promise;
  }

  newSuperhero.$inject = ['SuperherosService'];

  function newSuperhero(SuperherosService) {
    return new SuperherosService();
  }
}());
