var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Bears!
var BearSchema = new Schema({
  name:       { type:String },
  date:       { type:Date, default:Date.now }
});



module.exports = mongoose.model('Bear', BearSchema);
