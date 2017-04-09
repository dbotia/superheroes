'use strict';

describe('Superheros E2E Tests:', function () {
  describe('Test Superheros page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/superheros');
      expect(element.all(by.repeater('superhero in superheros')).count()).toEqual(0);
    });
  });
});
