var _ = require('lodash');
var Moment = require('moment');
var Promise = require('bluebird');
var git = require('./github');

var getCommits = git.getCommits;
var getText = git.getText;
var getTextFile = git.getTextFile;
var renderMarkdown = git.renderMarkdown;

var renderPost = (owner, repo, post) => {
  return Promise.join(getText(owner, repo, post.sha), getCommits(owner, repo, post.path), getTextFile(owner, repo, '.blog'), (pContent, pCommits, pConfig) => {
    const commit = _.last(pCommits);

    let content = _.trim(pContent.substr(pContent.indexOf('\n') + 1), '\n');
    let topics = [];

    let topicsStart = content.indexOf("\n\n```topics");
    if (topicsStart > -1) {
      let offset = 11;
      let topicsEnd = content.indexOf("```\n\n", topicsStart + offset)

      if (topicsStart > -1 && topicsEnd > -1) {
        topics = _.map(
          _.split(_.trim(content.substr(topicsStart + offset, topicsEnd - (topicsStart + offset))), ","), 
          topic => _.trim(topic));

        content = content.substr(0, topicsStart) + content.substr(topicsEnd + 5);
      }
    }

    let contentSnippet = content;
    let split = content.indexOf('---');

    if (split > -1) {
      contentSnippet = _.trim(content.substr(0, split), '\n');
      content = _.trim(content.substr(split + 4), '\n');
    }

    return {
      key: post.path,
      title: _.trim(_.trimStart(_.head(_.split(pContent, '\n')), '#')),
      topics: topics,
      link: `/${owner}/${repo}/posts/${post.path}`,
      author: commit.commit.author.name,
      publishedDate: Moment(new Date(commit.commit.author.date)).format(pConfig.dateFormat || 'MMMM DD, YYYY'),
      publishedTime: (new Date(commit.commit.author.date)).getTime() * 1,
      lastModifiedDate: Moment(new Date(_.first(pCommits).commit.author.date)).format(pConfig.dateFormat || 'MMMM DD, YYYY'),
      contentSnippet: contentSnippet,
      content: content
    }
  }).then((post) => {
    return Promise.join(
      renderMarkdown(owner, repo, `${post.key}-snippet`, post.contentSnippet),
      renderMarkdown(owner, repo, `${post.key}-content`, post.content),
      function(contentSnippet, content) {
        return _.assign({}, post, {
          content: content,
          contentSnippet: contentSnippet
        });
      });
  });
}

module.exports = {
    renderPost: renderPost
}