var graphql = require('graphql');

var List = graphql.GraphQLList;
var ObjectType = graphql.GraphQLObjectType;
var StringType = graphql.GraphQLString;
var NonNull = graphql.GraphQLNonNull;

var OwnerType = new ObjectType({
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
    github: {
      type: new NonNull(StringType)
    }
  }
});

var TemplateType = new ObjectType({
  name: 'Template',
  fields: {
    styles: {
      type: new List(StringType)
    },
    titles: {
      type: new List(new ObjectType({
        name: 'Title',
        fields: {
          file: {
            type: new NonNull(StringType)
          },
          title: {
            type: new NonNull(StringType)
          }
        }
      }))
    }
  }
});

var BlogType = new ObjectType({
  name: 'Blog',
  fields: {
    title: {
      type: new NonNull(StringType)
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
    },
    template: {
      type: new NonNull(TemplateType)
    }
  },
});

module.exports = {
  BlogType: BlogType
}