const _ = require('lodash');
const Promise = require('bluebird');
const GraphQL = require('graphql');
const BlogType = require('../types/BlogType').BlogType;
const GitHub = require('../../core/github');

const StringType = GraphQL.GraphQLString;
const NonNull = GraphQL.GraphQLNonNull;

const getRepoTree = GitHub.getRepoTree;
const getTextFile = GitHub.getTextFile;
const getUserData = GitHub.getUserData;

const blog = {
  type: BlogType,

  args: {
    owner: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    }
  },

  resolve(request, {owner, repo}) {
    return Promise.join(
      getRepoTree(owner, repo),
      getUserData(owner),
      getTextFile(owner, repo, '.blog'),
      ({tree}, user, pConfig) => {
        const config = JSON.parse(pConfig);

        return Promise.all(_.map(_.filter(tree, file => _.endsWith(file.path, '.css')), style => getTextFile(owner, repo, style.path))).then(styles => {
          return {
            title: config.title,
            url: `/${owner}/${repo}`,
            baseUrl: `/`,
            user: owner,
            repo: repo,
            owner: {
              name: user.name,
              location: user.location,
              company: user.company,
              url: user.blog,
              avatar: user.avatar_url,
              twitter: config.twitter,
              github: user.html_url
            }
          };
        });
      });

  }
};

module.exports = blog;
