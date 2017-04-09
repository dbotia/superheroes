'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Superhero Schema
 */
var SuperheroSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Superhero name',
    trim: true
  },
superpower: {
    type: String,
    default: '',
    required: 'coloque el superpoder',
    trim: true
  },
  debilidad: {
    type: String,
    default: '',
    required: 'Coloque la debilidad',
    trim: true
  },




  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Superhero', SuperheroSchema);
