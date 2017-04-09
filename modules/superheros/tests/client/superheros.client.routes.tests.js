(function () {
  'use strict';

  describe('Superheros Route Tests', function () {
    // Initialize global variables
    var $scope,
      SuperherosService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SuperherosService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SuperherosService = _SuperherosService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('superheros');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/superheros');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SuperherosController,
          mockSuperhero;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('superheros.view');
          $templateCache.put('modules/superheros/client/views/view-superhero.client.view.html', '');

          // create mock Superhero
          mockSuperhero = new SuperherosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Superhero Name'
          });

          // Initialize Controller
          SuperherosController = $controller('SuperherosController as vm', {
            $scope: $scope,
            superheroResolve: mockSuperhero
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:superheroId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.superheroResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            superheroId: 1
          })).toEqual('/superheros/1');
        }));

        it('should attach an Superhero to the controller scope', function () {
          expect($scope.vm.superhero._id).toBe(mockSuperhero._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/superheros/client/views/view-superhero.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SuperherosController,
          mockSuperhero;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('superheros.create');
          $templateCache.put('modules/superheros/client/views/form-superhero.client.view.html', '');

          // create mock Superhero
          mockSuperhero = new SuperherosService();

          // Initialize Controller
          SuperherosController = $controller('SuperherosController as vm', {
            $scope: $scope,
            superheroResolve: mockSuperhero
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.superheroResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/superheros/create');
        }));

        it('should attach an Superhero to the controller scope', function () {
          expect($scope.vm.superhero._id).toBe(mockSuperhero._id);
          expect($scope.vm.superhero._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/superheros/client/views/form-superhero.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SuperherosController,
          mockSuperhero;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('superheros.edit');
          $templateCache.put('modules/superheros/client/views/form-superhero.client.view.html', '');

          // create mock Superhero
          mockSuperhero = new SuperherosService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Superhero Name'
          });

          // Initialize Controller
          SuperherosController = $controller('SuperherosController as vm', {
            $scope: $scope,
            superheroResolve: mockSuperhero
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:superheroId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.superheroResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            superheroId: 1
          })).toEqual('/superheros/1/edit');
        }));

        it('should attach an Superhero to the controller scope', function () {
          expect($scope.vm.superhero._id).toBe(mockSuperhero._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/superheros/client/views/form-superhero.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
