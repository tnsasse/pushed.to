const GraphQL = require('graphql');

const blog = require('./resolvers/blog');
const post = require('./resolvers/post');
const posts = require('./resolvers/posts');
const render = require('./resolvers/render');

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
