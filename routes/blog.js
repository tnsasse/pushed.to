var config = require('../config');
var express = require('express');

var router = express.Router();

router.get('/:user/:project', function(req, res, next) {
  res.send('show posts ' + req.params.user + "/" + req.params.project);
});

router.use('/:user/:project', function(req, res, next) {
  res.send('show post ' + req.path + ", " + config.github.client_id);
});

module.exports = router;
