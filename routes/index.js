var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index Page' });
});

router.get('/events', function(req, res, next) {
  res.render('event', { title: 'Event Page' });
});

router.get('/oldthorns', function(req, res, next) {
  res.render('event', { title: 'Express' });
});

module.exports = router;
