const _ = require('lodash');
const graphql = require('graphql').graphql;
const express = require('express');
const Promise = require('promise');

const router = express.Router();
const schema = require('../data/schema');
const blogQuery = require('../data/queries/blog');
const postsQuery = require('../data/queries/posts');
const postQuery = require('../data/queries/post');
const getFile = require('../core/github').getFile;

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

          res.render('posts');
      });
  });

router.get('/:user/:project/posts/:page', (req, res) => {
  Promise
      .all(
          [ 
            graphql(schema, blogQuery(req.params.user, req.params.project)),
            graphql(schema, postsQuery(req.params.user, req.params.project, req.params.page))
          ])
      .then(responses => {
          res.locals.blog = responses[0].data.blog;
          res.locals.posts = responses[1].data.posts;

          res.render('posts');
      });
})

router.get('/:user/:project/topics/:topic', (req, res) => {
  Promise
      .all(
          [ 
            graphql(schema, blogQuery(req.params.user, req.params.project)),
            graphql(schema, postsQuery(req.params.user, req.params.project, 1, req.params.topic))
          ])
      .then(responses => {
        res.locals.selectedTopic = req.params.topic;
        res.locals.blog = responses[0].data.blog;
        res.locals.posts = responses[1].data.posts;

        res.render('posts');
      });
})

router.get('/:user/:project/topics/:topic/:page', (req, res) => {
  Promise
      .all(
          [ 
            graphql(schema, blogQuery(req.params.user, req.params.project)),
            graphql(schema, postsQuery(req.params.user, req.params.project, req.params.page, req.params.topic))
          ])
      .then(responses => {
          res.locals.selectedTopic = req.params.topic;
          res.locals.blog = responses[0].data.blog;
          res.locals.posts = responses[1].data.posts;

          res.render('posts');
      });
})

router.use('/:user/:project/posts', (req, res) => {
    if (_.endsWith(req.url, '.png')) {

    } else if (_.endsWith(req.url, '.jpg') || _.endsWith(req.url, '.jpeg')) {

    } else if (_.endsWith(req.url, '.gif')) {

    } else if (_.endsWith(req.url, '.bmp')) {

    } else {
      if (!_.endsWith(req.url,  '.md')) {
        req.url = req.url + '.md';
      }

      Promise
        .all(
            [ 
              graphql(schema, blogQuery(req.params.user, req.params.project)),
              graphql(schema, postQuery(req.params.user, req.params.project, req.url.substr(1)))
            ])
        .then(responses => {
            res.locals.blog = responses[0].data.blog;
            res.locals.post = responses[1].data.post;
            res.locals.posts = {
              posts: []
            };
            
            res.render('post');
        });
    }
})

module.exports = router;