var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Bears!
var BearSchema = new Schema({
  name: String
});



module.exports = mongoose.model('Bear', BearSchema);
