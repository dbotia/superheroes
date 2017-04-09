(function () {
  'use strict';

  angular
    .module('superheros')
    .controller('SuperherosListController', SuperherosListController);

  SuperherosListController.$inject = ['SuperherosService'];

  function SuperherosListController(SuperherosService) {
    var vm = this;

    vm.superheros = SuperherosService.query();
  }
}());
