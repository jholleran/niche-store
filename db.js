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
  catagory: [String],
  rating: { type: Number, default: 0 }
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


// Express middleware that hashes a password before it is saved to database
// The following function is invoked right when we called MongoDB save() method
// We can define middleware once and it will work everywhere that we use save() to save data to MongoDB
// The purpose of this middleware is to hash the password before saving to database, because
// we don't want to save password as plain text for security reasons
userSchema.pre('save', function (next) {
  'use strict';
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt with 10 rounds
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
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


module.exports.Product = Product;
module.exports.User = User;