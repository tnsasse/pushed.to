const _ = require('lodash');
const GraphQL = require('graphql');
const PostItemsType = require('../types/PostType').PostItemsType;
const GitHub = require('../../core/github');

const IntType = GraphQL.GraphQLInt;
const StringType = GraphQL.GraphQLString;
const NonNull = GraphQL.GraphQLNonNull;

const getRepoTree = GitHub.getRepoTree;
const getTextFile = GitHub.getTextFile;

const renderPost = require('../../core/posts').renderPost;

const posts = {
  type: PostItemsType,

  args: {
    owner: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    },
    page: {
      type: IntType
    },
    topic: {
      type: StringType
    }
  },

  resolve(request, {owner, repo, page, topic}) {
    if (!page)
      page = 1;

    return getRepoTree(owner, repo).then(({tree}) => {
      const result = _(tree)
        .filter(item => _.endsWith(item.path, '.md') && item.type === 'blob' && !_.endsWith(item.path, 'README.md'))
        .value();
      return result;
    }).all().then(posts => {
      return _.map(posts, post => {
        return renderPost(owner, repo, post);
      });
    }).all().then(posts => {
      if (topic) {
        return _.filter(posts, post => _.indexOf(post.topics, topic) > -1)
      } else {
        return posts;
      }
    }).all().then(posts => {
      return getTextFile(owner, repo, '.blog').then(pConfig => {
        const config = JSON.parse(pConfig);
        const ppp = pConfig.postPerPage || 3;
        const pages = Math.ceil(posts.length / ppp);

        let nextUrl;
        let prevUrl;

        if (topic) {
          nextUrl = page < pages && `/${owner}/${repo}/topics/${topic}/${page + 1}`;
          prevUrl = page > 1 && `/${owner}/${repo}/topics/${topic}/${page - 1}`;
        } else {
          nextUrl = page < pages && `/${owner}/${repo}/posts/${page + 1}`;
          prevUrl = page > 1 && `/${owner}/${repo}/posts/${page - 1}`;
        }

        return {
          posts: _.slice(_.orderBy(posts, ['publishedTime'], ['desc']), (page - 1) * ppp, page * ppp),
          pages: pages,
          page: page,
          nextUrl, 
          prevUrl
        }
      });
    });
  }
};

module.exports = posts;
