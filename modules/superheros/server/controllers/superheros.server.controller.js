'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Superhero = mongoose.model('Superhero'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Superhero
 */
exports.create = function(req, res) {
  var superhero = new Superhero(req.body);
  superhero.user = req.user;

  superhero.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(superhero);
    }
  });
};

/**
 * Show the current Superhero
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var superhero = req.superhero ? req.superhero.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  superhero.isCurrentUserOwner = req.user && superhero.user && superhero.user._id.toString() === req.user._id.toString();

  res.jsonp(superhero);
};

/**
 * Update a Superhero
 */
exports.update = function(req, res) {
  var superhero = req.superhero;

  superhero = _.extend(superhero, req.body);

  superhero.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(superhero);
    }
  });
};

/**
 * Delete an Superhero
 */
exports.delete = function(req, res) {
  var superhero = req.superhero;

  superhero.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(superhero);
    }
  });
};

/**
 * List of Superheros
 */
exports.list = function(req, res) {
  Superhero.find().sort('-created').populate('user', 'displayName').exec(function(err, superheros) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(superheros);
    }
  });
};

/**
 * Superhero middleware
 */
exports.superheroByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Superhero is invalid'
    });
  }

  Superhero.findById(id).populate('user', 'displayName').exec(function (err, superhero) {
    if (err) {
      return next(err);
    } else if (!superhero) {
      return res.status(404).send({
        message: 'No Superhero with that identifier has been found'
      });
    }
    req.superhero = superhero;
    next();
  });
};
