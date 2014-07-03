////////////////
// dependices
var express = require('express');
var router = express.Router();
var debug = require('debug')('niche-store');
var db = require('../db');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
  	title: 'Online Product Store',
  	heading: 'Niche Site Online Store',
    lead: 'The leading next generation Niche Test site and recommendation engine',
    user: req.session.user
  });
});


router.get('/products', function(req, res, next) {

  db.Product.find().exec(function (err, products) {
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
  db.Product.find(function(err, products) {
    if (err) return next(err);
    res.send(products);
  });
});

router.get('/api/products/:slug', function(req, res, next) {
  db.Product.findOne({'slug' : req.params.slug})
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
  var product = new db.Product(req.body);
  product.save(function (err) {
    if (err) {
      debug('Unable to add the game to database: ', err.stack);
      next(err);
    } else {
      res.redirect('/products');
    }
  });
});

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

  var user = new db.User({
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
  if (req.session.user) {
    res.redirect('/');
  }
  

  res.render('login', {
    heading: 'Sign In',
    lead: 'Use the login form if you are an existing user',
    user: req.session.user,
    incorrectLogin: req.session.incorrectLogin,
    message: { success: req.session.message }
  });
});

/**
 * POST /login
 */
router.post('/login', function (req, res) {
 'use strict';
  db.User.findOne({ 'email': req.body.userEmail }, function (err, user) {
    if (err) {
      res.send(500, err);
    }

    if (!user) {
      req.session.incorrectLogin = true;
      res.redirect('/login');
    } else {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {
          res.send(500, err);
        }
        if (!isMatch) {
          req.session.incorrectLogin = true;
          res.redirect('/login');
        } else {
          delete req.session.incorrectLogin;
          req.session.user = user;
          res.redirect('/');
        }
      });
    }
  });
});


/**
 * GET /logout
 */
router.get('/logout', function (req, res) {
  'use strict';

  if (!req.session.user) {
    return res.redirect('/');
  }

  req.session.destroy(function () {
    res.redirect('/');
  });
});

module.exports = router;
