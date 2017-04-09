'use strict';

/**
 * Module dependencies
 */
var superherosPolicy = require('../policies/superheros.server.policy'),
  superheros = require('../controllers/superheros.server.controller');

module.exports = function(app) {
  // Superheros Routes
  app.route('/api/superheros').all(superherosPolicy.isAllowed)
    .get(superheros.list)
    .post(superheros.create);

  app.route('/api/superheros/:superheroId').all(superherosPolicy.isAllowed)
    .get(superheros.read)
    .put(superheros.update)
    .delete(superheros.delete);

  // Finish by binding the Superhero middleware
  app.param('superheroId', superheros.superheroByID);
};
