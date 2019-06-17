const graphql = require('graphql');

const List = graphql.GraphQLList;
const ObjectType = graphql.GraphQLObjectType;
const StringType = graphql.GraphQLString;
const NonNull = graphql.GraphQLNonNull;

const OwnerType = new ObjectType({
  name: 'Owner',
  fields: {
    name: {
      type: new NonNull(StringType)
    },
    company: {
      type: StringType
    },
    location: {
      type: StringType
    },
    url: {
      type: StringType
    },
    avatar: {
      type: new NonNull(StringType)
    },
    twitter: {
      type: StringType
    },
    linkedin: {
      type: StringType
    },
    github: {
      type: new NonNull(StringType)
    }
  }
});

const BlogType = new ObjectType({
  name: 'Blog',
  fields: {
    title: {
      type: new NonNull(StringType)
    },
    description: {
      type: StringType
    },
    topics: {
      type: List(StringType)
    },
    analyticsId: {
      type: StringType
    },
    url: {
      type: new NonNull(StringType)
    },
    baseUrl: {
      type: new NonNull(StringType)
    },
    user: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    },
    owner: {
      type: new NonNull(OwnerType)
    }
  },
});

module.exports = {
  BlogType: BlogType
}