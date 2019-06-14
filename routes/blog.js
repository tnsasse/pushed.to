const graphql = require('graphql').graphql;
const express = require('express');
const Promise = require('promise');

const router = express.Router();
const schema = require('../data/schema');
const blogQuery = require('../data/queries/blog');
const postsQuery = require('../data/queries/posts');
const postQuery = require('../data/queries/post');

router.get('/:user/:project', (req, res) => {
    Promise
      .all(
          [ 
            graphql(schema, blogQuery(req.params.user, req.params.project)),
            graphql(schema, postsQuery(req.params.user, req.params.project))
          ])
      .then(responses => {
          res.locals.blog = responses[0].data.blog;
          res.locals.posts = responses[1].data.posts;

          console.log(JSON.stringify(res.locals, null, 2));

          res.render('posts');
      });
  });

router.get('/:user/:project/history/:page', (req, res) => {
  Promise
    .all(
        [ 
          graphql(schema, blogQuery(req.params.user, req.params.project)),
          graphql(schema, postsQuery(req.params.user, req.params.project, req.params.page))
        ])
        .then(responses => {
          const response = {
            blog: responses[0].data,
            posts: responses[1].data
          }

          res.locals = response;
          res.render('posts');
      });
})

router.use('/:user/:project/post', (req, res) => {
    Promise
      .all(
          [ 
            graphql(schema, blogQuery(req.params.user, req.params.project)),
            graphql(schema, postQuery(req.params.user, req.params.project, req.url.substr(1)))
          ])
      .then(responses => {
          const response = {
            blog: responses[0].data,
            posts: responses[1].data
          }

          res.locals = response;
          res.render('post');
      });
})

module.exports = router;