////////////////
// dependices
var express = require('express');
var router = express.Router();
var debug = require('debug')('niche-store');
var db = require('../db');

router.get('/products', function(req, res, next) {
  db.Product.find(function(err, products) {
    if (err) return next(err);
    res.send(products);
  });
});

router.get('/products/:slug', function(req, res, next) {
  db.Product.findOne({'slug' : req.params.slug})
    .exec(function(err, product) {
      if (err) return next(err);
      debug('Found Product: %j', product);
      res.send(product);
  });
});

module.exports = router;
