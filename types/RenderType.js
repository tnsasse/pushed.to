import { GraphQLObjectType as ObjectType, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';

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

export default RenderType;
