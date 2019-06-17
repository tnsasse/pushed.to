const GraphQL = require('graphql');
const PostItemType = require('../types/PostType').PostType;
const GitHub = require('../../core/github');

const StringType = GraphQL.GraphQLString;
const NonNull = GraphQL.GraphQLNonNull;

const getFile = GitHub.getFile;
const renderPost = require('../../core/posts').renderPost;

const post = {

  type: PostItemType,

  args: {
    owner: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    },
    key: {
      type: new NonNull(StringType)
    }
  },

  resolve(request, {owner, repo, key}) {
    return getFile(owner, repo, key).then(post => {
      return renderPost(owner, repo, post);
    });
  }

};

module.exports = post;
