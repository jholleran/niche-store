////////////////
// dependices
var debug = require('debug')('niche-store');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');


var productSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  title: String,
  description: String,
  price: Number,
  image: String,
  catagory: [String]
});    


var Product = mongoose.model('Product', productSchema);


// In Mongoose everything is derived from Schema.
// Here we create a schema called User with the following fields.
// Each field requires a type and optional additional properties, e.g. unique field? required field?
var userSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true }},
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  joined_on: { type: Date, default: Date.now() },
  isAdmin: Boolean,
  purchasedProducts: [{
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    date: { type: Date, default: Date.now() }
  }],
  viewedProducts: [String],
  lastLogin: Boolean
});

// This middleware compares user's typed-in password during login with the password stored in database
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  'use strict';
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// User model based on schema
var User = mongoose.model('User', userSchema);

debug("Connecting to database...");
mongoose.connect('localhost');
debug("Connected to database.");


module.exports.productSchema = productSchema;
module.exports.UserSchema = userSchema;
module.exports.Product = Product;
module.exports.User = User;