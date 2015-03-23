var express = require('express'),
  mongoskin = require('mongoskin'),
  bodyParser = require('body-parser')
  logger = require('morgan')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));

//local database
var db = mongoskin.db('mongodb://@localhost:27017/nodetest4', {safe:true});
var port = 3005;

app.param('geojson', function(req, res, next, geojson){
  req.collection = db.collection(geojson);
  return next();
})

app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /geojson/');
})

// This will respond to a GET request to http://localhost:3005/geojson/geojson
app.get('/geojson/:geojson', function(req, res, next) {
  //res.send('This lands');
  req.collection.find({} ,{limit: 10, sort: {'_id': -1}}).toArray(function(e, results){
    if (e) return next(e);
    res.send(results);
  })
})


app.listen(port, function(){
  console.log('Express server listening on port '+port);
})
