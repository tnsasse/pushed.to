const GraphQL = require('graphql');

const blog = require('./queries/blog');
const post = require('./queries/post');
const posts = require('./queries/posts');
const render = require('./queries/render');

const Schema = GraphQL.GraphQLSchema;
const ObjectType = GraphQL.GraphQLObjectType;

module.exports = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      blog,
      post,
      posts,
      render
    }
  }),
});
