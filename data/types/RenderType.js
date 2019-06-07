const graphql = require('graphql');

const ObjectType = graphql.GraphQLObjectType;
const StringType = graphql.GraphQLString;
const NonNull = graphql.GraphQLNonNull;

const RenderType = new ObjectType({
  name: 'Render',
  fields: {
    result: {
      type: new NonNull(StringType)
    },
    data: {
      type: StringType
    }
  }
});

module.exports = {
  RenderType: RenderType
};
