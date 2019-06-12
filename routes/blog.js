const github = require('../core/github');
const graphql = require('graphql').graphql;
const express = require('express');

const router = express.Router();

const schema = require('../data/schema');
const renderPostsQuery = require('../data/queries/render-posts');

router.get('/:user/:project', (req, res) => {
  graphql(schema, renderPostsQuery(req.params.user, req.params.project)).then(response => {
    res.send(JSON.stringify(response, null, 2));
  })
});

module.exports = router;
