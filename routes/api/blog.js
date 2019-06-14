const graphql = require('graphql').graphql;
const express = require('express');

const router = express.Router();
const schema = require('../../data/schema');
const blogQuery = require('../../data/queries/blog');
const postsQuery = require('../../data/queries/posts');
const postQuery = require('../../data/queries/post');

router.get('/:user/:project', (req, res) => {
    graphql(schema, blogQuery(req.params.user, req.params.project)).then(({ data }) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data, null, 2));
    });
  });

router.get('/:user/:project/posts', (req, res) => {
    graphql(schema, postsQuery(req.params.user, req.params.project)).then(({ data }) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data, null, 2));
    });
})

router.get('/:user/:project/posts/:page', (req, res) => {
    graphql(schema, postsQuery(req.params.user, req.params.project, req.params.page)).then(({ data }) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data, null, 2));
    });
})

router.use('/:user/:project/post', (req, res) => {
    const query = postQuery(req.params.user, req.params.project, req.url.substr(1));

    console.log(query);

    graphql(schema, query).then(response => {
        res.send(response);
    });
})

module.exports = router;