import { GraphQLList as List, GraphQLObjectType as ObjectType, GraphQLInt as IntType, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';

const PostType = new ObjectType({
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

export const PostItemsType = new ObjectType({
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

export default PostType;
