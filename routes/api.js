'use strict';

////////////////
// dependices
var express = require('express');
var router = express.Router();
var debug = require('debug')('niche-store');
var db = require('../db');

/**
 * Only allows the route to be accessed if the user is an admin.
 */
function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    debug('Permission denied: %j', req.session.user);
    return next(new Error("Permission denied."));
  }

  next();
}

router.get('/products', requireAdmin, function(req, res, next) {;
  db.Product.find(function(err, products) {
    if (err) return next(err);
    res.send(products);
  });
});

router.get('/products/:slug', requireAdmin, function(req, res, next) {
  db.Product.findOne({'slug' : req.params.slug})
    .exec(function(err, product) {
      if (err) return next(err);
      debug('Found Product: %j', product);
      res.send(product);
  });
});

module.exports = router;
