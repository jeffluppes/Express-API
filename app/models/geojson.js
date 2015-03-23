var mongoose = require('mongoose');
var GeoJSON = require('mongoose-geojson-schema');
//GeoJSON
var schema = new mongoose.Schema({
    geoFeature:GeoJSON.Feature
});



module.exports = mongoose.model('Geojson', schema);
