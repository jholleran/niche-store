var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
  	title: 'Online Product Store',
  	heading: 'Niche Site Online Store',
    lead: 'The leading next generation Niche Test site and recommendation engine'
  });
});


router.get('/products', function(req, res) {
  res.render('products', { 
  	title: 'Online Products Store',
  	heading: 'Top Products',
    lead: 'Product titles listed by popularity rating',
    products: []
  });
});

module.exports = router;
