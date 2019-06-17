const _ = require('lodash');
const graphql = require('graphql').graphql;
const express = require('express');
const Promise = require('promise');

const router = express.Router();
const schema = require('../data/schema');
const blogQuery = require('../data/queries/blog');
const postsQuery = require('../data/queries/posts');
const postQuery = require('../data/queries/post');
const getRawFile = require('../core/github').getRawFile;

const static = (req, res, contentType) => {
  getRawFile(req.params.user, req.params.project, req.url.substr(1))
    .then(file => {
      res.header('Content-Type', contentType);
      res.header('Content-Length', file.length);
      res.end(file);
    })
    .catch(error => {
      res.status(404);
      res.end();
    });
}

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

      if (_.isNull(res.locals.blog)) {
        res.locals.message = `No blog defined at github.com/${req.params.user}/${req.params.project}`;
        res.locals.error = { status: 404 };

        res.status(404);
        res.render('error');
      } else {
        res.render('posts');
      }
    });
});

router.get('/:user/:project/posts/:page', (req, res, next) => {
  if (!_.isNumber(req.params.page)) {
    next();
  } else {
    Promise
      .all(
        [
          graphql(schema, blogQuery(req.params.user, req.params.project)),
          graphql(schema, postsQuery(req.params.user, req.params.project, req.params.page))
        ])
      .then(responses => {
        res.locals.blog = responses[0].data.blog;
        res.locals.posts = responses[1].data.posts;

        if (_.isNull(res.locals.blog)) {
          res.locals.message = `No blog defined at github.com/${req.params.user}/${req.params.project}`;
          res.locals.error = { status: 404 };

          res.status(404);
          res.render('error');
        } else {
          res.render('posts');
        }
      });
  }
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

      if (_.isNull(res.locals.blog)) {
        res.locals.message = `No blog defined at github.com/${req.params.user}/${req.params.project}`;
        res.locals.error = { status: 404 };

        res.status(404);
        res.render('error');
      } else {
        res.render('posts');
      }
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

      if (_.isNull(res.locals.blog)) {
        res.locals.message = `No blog defined at github.com/${req.params.user}/${req.params.project}`;
        res.locals.error = { status: 404 };

        res.status(404);
        res.render('error');
      } else {
        res.render('posts');
      }
    });
})

router.use('/:user/:project/posts', (req, res) => {
  if (_.endsWith(req.url, '.png')) {
    static(req, res, 'image/png');
  } else if (_.endsWith(req.url, '.jpg') || _.endsWith(req.url, '.jpeg')) {
    static(req, res, 'image/jpeg');
  } else if (_.endsWith(req.url, '.gif')) {
    static(req, res, 'image/gif');
  } else if (_.endsWith(req.url, '.bmp')) {
    static(req, res, 'image/bmp');
  } else {
    if (!_.endsWith(req.url, '.md')) {
      req.url = req.url + '.md';
    }

    Promise
      .all(
        [
          graphql(schema, blogQuery(req.params.user, req.params.project)),
          graphql(schema, postQuery(req.params.user, req.params.project, req.url.substr(1)))
        ])
      .then(responses => {
        console.log(JSON.stringify(responses, null, 2));
        res.locals.blog = responses[0].data.blog;
        res.locals.post = responses[1].data.post;
        res.locals.posts = {
          posts: []
        };

        if (_.isNull(res.locals.blog)) {
          res.locals.message = `No blog defined at github.com/${req.params.user}/${req.params.project}`;
          res.locals.error = { status: 404 };
          res.render('error');
        } else if (_.isNull(res.locals.post)) {
          res.locals.message = `This post does not exist on github.com/${req.params.user}/${req.params.project}`;
          res.locals.error = { status: 404 };

          res.status(404);
          res.render('error');
        } else {
          res.render('post');
        }
      });
  }
});

module.exports = router;