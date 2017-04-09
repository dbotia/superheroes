'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Superhero = mongoose.model('Superhero'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  superhero;

/**
 * Superhero routes tests
 */
describe('Superhero CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Superhero
    user.save(function () {
      superhero = {
        name: 'Superhero name'
      };

      done();
    });
  });

  it('should be able to save a Superhero if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Superhero
        agent.post('/api/superheros')
          .send(superhero)
          .expect(200)
          .end(function (superheroSaveErr, superheroSaveRes) {
            // Handle Superhero save error
            if (superheroSaveErr) {
              return done(superheroSaveErr);
            }

            // Get a list of Superheros
            agent.get('/api/superheros')
              .end(function (superherosGetErr, superherosGetRes) {
                // Handle Superheros save error
                if (superherosGetErr) {
                  return done(superherosGetErr);
                }

                // Get Superheros list
                var superheros = superherosGetRes.body;

                // Set assertions
                (superheros[0].user._id).should.equal(userId);
                (superheros[0].name).should.match('Superhero name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Superhero if not logged in', function (done) {
    agent.post('/api/superheros')
      .send(superhero)
      .expect(403)
      .end(function (superheroSaveErr, superheroSaveRes) {
        // Call the assertion callback
        done(superheroSaveErr);
      });
  });

  it('should not be able to save an Superhero if no name is provided', function (done) {
    // Invalidate name field
    superhero.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Superhero
        agent.post('/api/superheros')
          .send(superhero)
          .expect(400)
          .end(function (superheroSaveErr, superheroSaveRes) {
            // Set message assertion
            (superheroSaveRes.body.message).should.match('Please fill Superhero name');

            // Handle Superhero save error
            done(superheroSaveErr);
          });
      });
  });

  it('should be able to update an Superhero if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Superhero
        agent.post('/api/superheros')
          .send(superhero)
          .expect(200)
          .end(function (superheroSaveErr, superheroSaveRes) {
            // Handle Superhero save error
            if (superheroSaveErr) {
              return done(superheroSaveErr);
            }

            // Update Superhero name
            superhero.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Superhero
            agent.put('/api/superheros/' + superheroSaveRes.body._id)
              .send(superhero)
              .expect(200)
              .end(function (superheroUpdateErr, superheroUpdateRes) {
                // Handle Superhero update error
                if (superheroUpdateErr) {
                  return done(superheroUpdateErr);
                }

                // Set assertions
                (superheroUpdateRes.body._id).should.equal(superheroSaveRes.body._id);
                (superheroUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Superheros if not signed in', function (done) {
    // Create new Superhero model instance
    var superheroObj = new Superhero(superhero);

    // Save the superhero
    superheroObj.save(function () {
      // Request Superheros
      request(app).get('/api/superheros')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Superhero if not signed in', function (done) {
    // Create new Superhero model instance
    var superheroObj = new Superhero(superhero);

    // Save the Superhero
    superheroObj.save(function () {
      request(app).get('/api/superheros/' + superheroObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', superhero.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Superhero with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/superheros/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Superhero is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Superhero which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Superhero
    request(app).get('/api/superheros/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Superhero with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Superhero if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Superhero
        agent.post('/api/superheros')
          .send(superhero)
          .expect(200)
          .end(function (superheroSaveErr, superheroSaveRes) {
            // Handle Superhero save error
            if (superheroSaveErr) {
              return done(superheroSaveErr);
            }

            // Delete an existing Superhero
            agent.delete('/api/superheros/' + superheroSaveRes.body._id)
              .send(superhero)
              .expect(200)
              .end(function (superheroDeleteErr, superheroDeleteRes) {
                // Handle superhero error error
                if (superheroDeleteErr) {
                  return done(superheroDeleteErr);
                }

                // Set assertions
                (superheroDeleteRes.body._id).should.equal(superheroSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Superhero if not signed in', function (done) {
    // Set Superhero user
    superhero.user = user;

    // Create new Superhero model instance
    var superheroObj = new Superhero(superhero);

    // Save the Superhero
    superheroObj.save(function () {
      // Try deleting Superhero
      request(app).delete('/api/superheros/' + superheroObj._id)
        .expect(403)
        .end(function (superheroDeleteErr, superheroDeleteRes) {
          // Set message assertion
          (superheroDeleteRes.body.message).should.match('User is not authorized');

          // Handle Superhero error error
          done(superheroDeleteErr);
        });

    });
  });

  it('should be able to get a single Superhero that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Superhero
          agent.post('/api/superheros')
            .send(superhero)
            .expect(200)
            .end(function (superheroSaveErr, superheroSaveRes) {
              // Handle Superhero save error
              if (superheroSaveErr) {
                return done(superheroSaveErr);
              }

              // Set assertions on new Superhero
              (superheroSaveRes.body.name).should.equal(superhero.name);
              should.exist(superheroSaveRes.body.user);
              should.equal(superheroSaveRes.body.user._id, orphanId);

              // force the Superhero to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Superhero
                    agent.get('/api/superheros/' + superheroSaveRes.body._id)
                      .expect(200)
                      .end(function (superheroInfoErr, superheroInfoRes) {
                        // Handle Superhero error
                        if (superheroInfoErr) {
                          return done(superheroInfoErr);
                        }

                        // Set assertions
                        (superheroInfoRes.body._id).should.equal(superheroSaveRes.body._id);
                        (superheroInfoRes.body.name).should.equal(superhero.name);
                        should.equal(superheroInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Superhero.remove().exec(done);
    });
  });
});
