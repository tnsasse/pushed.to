const config = require('../config');
const github = require('../core/github');
const express = require('express');

const router = express.Router();

router.get('/:user/:project', (req, res, next) => {
  res.send('show posts ' + req.params.user + "/" + req.params.project);
});

router.use('/:user/:project', (req, res, next) => {
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
