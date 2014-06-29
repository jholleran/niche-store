////////////////
// dependices
var express = require('express');
var router = express.Router();
var debug = require('debug')('niche-store');
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


module.exports = router;
