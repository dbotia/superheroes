(function () {
  'use strict';

  angular
    .module('superheros')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Superheros',
      state: 'superheros',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'superheros', {
      title: 'List Superheros',
      state: 'superheros.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'superheros', {
      title: 'Create Superhero',
      state: 'superheros.create',
      roles: ['user']
    });
  }
}());
