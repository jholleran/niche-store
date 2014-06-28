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



    var products = [
    	{slug : "ptz-ip-cam-1", title : "PTZ IP Camera 1", description : "Network IP Camera with Pan, Tilt & Zoom.", price : "$55.50", largeImage : "IP-PTZ-CAM-1.jpg", genre : "ip camera" },
    	{slug : "ptz-ip-cam-2", title : "PTZ IP Camera 2", description : "Pan, Tilt & Zoom IP Camera with dual ....", price : "$82", largeImage : "IP-PTZ-CAM-2.jpg", genre : "ip camera" },
    	{slug : "ptz-ip-cam-3", title : "PTZ IP Camera 3", description : "High Quality Network IP Camera with Pan, Tilt & Zoom.", price : "$105", largeImage : "IP-PTZ-CAM-3.jpg", genre : "ip camera" }
    ];

  res.render('products', { 
  	title: 'Online Products Store',
  	heading: 'IP Cameras',
    lead: 'Product titles listed by popularity rating',
    products: products
  });
});


router.get('/add', function(req, res) {

  res.render('add', { 
  	title: 'Add Product to Store',
  	heading: 'Add Product',
    lead: 'Enter add the information about the product'
  });
});

module.exports = router;
