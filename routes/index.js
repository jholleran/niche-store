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

module.exports = router;
