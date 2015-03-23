// RESTful Express API for GeoJSON.

var express = require('express'),
mongoskin = require('mongoskin'),
bodyParser = require('body-parser'),
logger = require('morgan')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

//local database, cater this to your own needs
var db = mongoskin.db('mongodb://@localhost:27017/nodetest4', {safe:true});
var port = 3005;

app.param('geojson', function(req, res, next, geojson){
  req.collection = db.collection(geojson);
  return next();
})

// ==== ROUTES BELOW ====

// error catching
app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /geojson/');
})

// This will respond to a GET request to http://localhost:3005/geojson/geojson
app.get('/geojson/:geojson', function(req, res, next) {
  req.collection.find({} ,{limit: 10, sort: {'_id': -1}}).toArray(function(e, results){
    if (e) return next(e);
    res.send(results);
  })
})

// This will respond to a POST request and import whichever data is sent in.
app.post('/geojson/:geojson', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e);
    res.send(results);
  })
})


// This will respond to a GET request for a specific data set.
app.get('/geojson/:geojson/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e);
    res.send(result);
  })
})

// This will PUT and update the specified record.
app.put('/geojson/:geojson/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function(e, result){
    if (e) return next(e);
    res.send((result === 1) ? {msg:'The update was a success'} : {msg: 'error'});
  })
})

// Finally, this will DELETE the set specified. Be careful with this great power.
app.delete('/geojson/:geojson/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e);
    res.send((result === 1)?{msg: 'The deletion was a success'} : {msg: 'error'});
  })
})

app.listen(port, function(){
  console.log('Express server listening on port '+port);
})
