var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//GeoJSON
var BearSchema = new Schema({
  name: String
});



module.exports = mongoose.model('Bear', BearSchema);
