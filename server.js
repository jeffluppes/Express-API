// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080; // set our port
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodetest4'); // connect to our database
var Bear = require('./app/models/bear');
var Geojson = require('./app/models/geojson');

// ROUTES FOR OUR API
// create our router
var router = express.Router();

// middleware to use for all requests, logs but doesnt really tell much.
// TODO: make a better log message
router.use(function(req, res, next) {
  // do logging
  console.log('Something happened!');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'API up and running. Travel safe. ;)' });
});


// ======== BEARS (from example!) =========
// ======== Skip to line 101 for Geojson ==
// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')
// create a bear (accessed at POST http://localhost:8080/bears)
.post(function(req, res) {
  var bear = new Bear(); // create a new instance of the Bear model
  bear.name = req.body.name; // set the bears name (comes from the request)
  bear.save(function(err) {
    if (err)
    res.send(err);
    res.json({ message: 'Bear created!' });
  });
})



// get all the bears (accessed at GET http://localhost:8080/api/bears)
.get(function(req, res) {
  Bear.find(function(err, bears) {
    if (err)
    res.send(err);
    res.json(bears);
  });
});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')
// get the bear with that id
.get(function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
    if (err)
    res.send(err);
    res.json(bear);
  });
})

// update the bear with this id
.put(function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
    if (err)
    res.send(err);
    bear.name = req.body.name;
    bear.save(function(err) {
      if (err)
      res.send(err);
      res.json({ message: 'Bear updated!' });
    });
  });
})

// delete the bear with this id
.delete(function(req, res) {
  Bear.remove({
    _id: req.params.bear_id
  }, function(err, bear) {
    if (err)
    res.send(err);
    res.json({ message: 'Successfully deleted' });
  });
});


// ======== GEOJSON =========
// on routes that end in /geojson - unlikely to work
// ----------------------------------------------------
router.route('/geojson')
// create a geojson object (accessed at POST http://localhost:8080/geojson)
  .post(function(req, res) {
    var geojson = new Geojson(); // create a new instance of the GeoJSON model
    geojson = req;
    geojson.save(function(err) {
      if (err)
      res.send(err);
      res.json({ message: 'GeoJSON created!' });
    });
  })



  // get all the geojson (accessed at GET http://localhost:8080/api/geojson)
  // Despite horrible nomeclature, should work.
  .get(function(req, res) {
    Geojson.find(function(err, geojsons) {
      if (err)
        res.send(err);
      res.json(geojsons);
    });
  });

  // on routes that end in /geojson/:geojson_id
  // ----------------------------------------------------
  router.route('/geojson/:geojson_id')
  // get the geojson with that id
  .get(function(req, res) {
    Geojson.findById(req.params.geojson_id, function(err, geojson) {
      if (err)
      res.send(err);
      res.json(geojson);
    });
  })

  // update the bear with this id
  .put(function(req, res) {
    Geojson.findById(req.params.bear_id, function(err, geojson) {
      if (err)
      res.send(err);
      geojson.name = req.body.name;
      geojson.save(function(err) {
        if (err)
        res.send(err);
        res.json({ message: 'Bear updated!' });
      });
    });
  })

  // delete the bear with this id
  .delete(function(req, res) {
    Bear.remove({
      _id: req.params.bear_id
    }, function(err, bear) {
      if (err)
      res.send(err);
      res.json({ message: 'Successfully deleted' });
    });
  });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('The magic happens on port: ' + port);
