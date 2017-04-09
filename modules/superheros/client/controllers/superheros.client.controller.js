(function () {
  'use strict';

  // Superheros controller
  angular
    .module('superheros')
    .controller('SuperherosController', SuperherosController);

  SuperherosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'superheroResolve'];

  function SuperherosController ($scope, $state, $window, Authentication, superhero) {
    var vm = this;

    vm.authentication = Authentication;
    vm.superhero = superhero;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Superhero
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.superhero.$remove($state.go('superheros.list'));
      }
    }

    // Save Superhero
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.superheroForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.superhero._id) {
        vm.superhero.$update(successCallback, errorCallback);
      } else {
        vm.superhero.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('superheros.view', {
          superheroId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
