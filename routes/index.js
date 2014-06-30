////////////////
// dependices
var express = require('express');
var router = express.Router();
var debug = require('debug')('niche-store');
var mongoose = require('mongoose');


var bcrypt = require('bcrypt');


var productSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  title: String,
  description: String,
  price: Number,
  image: String,
  catagory: [String]
});    


var Product = mongoose.model('Product', productSchema);

debug("Connecting to database...");
mongoose.connect('localhost');
debug("Connected to database.");


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
  	title: 'Online Product Store',
  	heading: 'Niche Site Online Store',
    lead: 'The leading next generation Niche Test site and recommendation engine'
  });
});


router.get('/products', function(req, res, next) {

  Product.find().exec(function (err, products) {
    if(err) {
      debug('Unable to read the products from the database: ', err.stack);
      next(err);
    } else {    
      debug('Found All Products: %j', products);
      res.render('products', { 
        title: 'Online Products Store',
        heading: 'IP Cameras',
        lead: 'Product titles listed by popularity rating',
        products: products
      });
    }
  });
});


router.get('/api/products', function(req, res, next) {
  Product.find(function(err, products) {
    if (err) return next(err);
    res.send(products);
  });
});

router.get('/api/products/:slug', function(req, res, next) {
  Product.findOne({'slug' : req.params.slug})
    .exec(function(err, product) {
      if (err) return next(err);
      debug('Found Product: %j', product);
      res.send(product);
  });
});

router.get('/add', function(req, res) {

  res.render('add', { 
  	title: 'Add Product to Store',
  	heading: 'Add Product',
    lead: 'Enter add the information about the product'
  });
});

router.post('/add', function(req, res, next) {

  debug('Adding Product %j', req.body);
  var product = new Product(req.body);
  product.save(function (err) {
    if (err) {
      debug('Unable to add the game to database: ', err.stack);
      next(err);
    } else {
      res.redirect('/products');
    }
  });
});







// In Mongoose everything is derived from Schema.
// Here we create a schema called User with the following fields.
// Each field requires a type and optional additional properties, e.g. unique field? required field?
var UserSchema = new mongoose.Schema({
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
UserSchema.pre('save', function (next) {
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
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  'use strict';
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// User model based on schema
var User = mongoose.model('User', UserSchema);

/**
 * Register Routes
 */
router.get('/register', function(req, res) {
  'use strict';

  if (req.session.user) {
    res.redirect('/');
  }
  

  res.render('register', {
    heading: 'Create Account',
    lead: 'Register with us to get your own personalized profile',
  });
});


/**
 * POST /register
 */
router.post('/register', function(req, res, next) {
  'use strict';

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.userEmail;
  var password = req.body.password;

  var user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    admin: false
  });

  user.save(function (err) {
    if (err) {
      debug('Unable to save user to the database: ', err.stack);
      next(err);
    }
    req.session.user = user;
    res.redirect('/');
  });
});


/**
 * GET /login
 */
router.get('/login', function(req, res) {
  'use strict';
  /*
  if (req.session.user) {
    res.redirect('/');
  }
  */

  res.render('login', {
    heading: 'Sign In',
    lead: 'Use the login form if you are an existing user',
   // user: req.session.user,
    //incorrectLogin: req.session.incorrectLogin,
    //message: { success: req.session.message }
  });
});

module.exports = router;
