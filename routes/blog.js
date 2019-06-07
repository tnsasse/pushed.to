var config = require('../config');
var github = require('../core/github');
var express = require('express');

var router = express.Router();

router.get('/:user/:project', function(req, res, next) {
  res.send('show posts ' + req.params.user + "/" + req.params.project);
});

router.use('/:user/:project', function(req, res, next) {
  github
    .getRepoTree(req.params.user, req.params.project)
    .then(commits => {
      console.log(JSON.stringify(commits, null, 2));
      console.log('huhuhu');
      res.send('show post');
    })
    .catch(error => {
      console.log('EERRROR');
      console.log(error);
      res.send('error');
    });
});

module.exports = router;
