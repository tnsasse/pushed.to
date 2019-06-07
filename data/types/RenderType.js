var graphql = require('graphql');

var ObjectType = graphql.GraphQLObjectType;
var StringType = graphql.GraphQLString;
var NonNull = graphql.GraphQLNonNull;

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
