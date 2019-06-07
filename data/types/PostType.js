var graphql = require('graphql');

var List = graphql.GraphQLList;
var ObjectType = graphql.GraphQLObjectType;
var IntType = graphql.GraphQLInt;
var StringType = graphql.GraphQLString;
var NonNull = graphql.GraphQLNonNull;

var PostType = new ObjectType({
  name: 'PostItem',
  fields: {
    key: {
      type: new NonNull(StringType)
    },
    title: {
      type: new NonNull(StringType)
    },
    link: {
      type: new NonNull(StringType)
    },
    author: {
      type: StringType
    },
    lastModifiedDate: {
      type: new NonNull(StringType)
    },
    publishedDate: {
      type: new NonNull(StringType)
    },
    publishedTime: {
      type: StringType
    },
    contentSnippet: {
      type: StringType
    },
    content: {
      type: StringType
    }
  },
});

var PostItemsType = new ObjectType({
  name: 'PostItems',

  fields: {
    posts: {
      type: new List(PostType)
    },
    pages: {
      type: IntType
    },
    page: {
      type: IntType
    },
    nextUrl: {
      type: StringType
    },
    prevUrl: {
      type: StringType
    }
  }
});

module.exports = {
  PostItemsType: PostItemsType,
  PostType: PostType
}
