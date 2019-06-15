var _ = require('lodash');
var config = require('../config');
var Octokit = require('@octokit/rest');
var NodeCache = require('node-cache');
var Promise = require('bluebird');

var cache = new NodeCache({
  stdTTL: 600
});

var github = () => {
  var github = new Octokit({
    auth: {
      clientId: config.github.client_id,
      clientSecret: config.github.client_secret
    },
    userAgent: 'pushed.to',
    log: {
        debug: () => {},
        info: () => {},
        warn: console.warn,
        error: console.error
      },
    
    request: {
        agent: undefined,
        fetch: undefined,
        timeout: 5000
    }
  });

  return github;
}

function getBlob(owner, repo, sha) {
  var key = `${owner}/${repo}/blobs/${sha}`;

  return new Promise((res, rej) => {
    var handle = handler(res, rej, {
      key: key,
      ttl: 600
    });

    cache.get(key, (err, value) => {
      if (!value) {
        github()
          .git
          .getBlob({
            owner: owner,
            repo: repo,
            file_sha: sha
          })
          .then(response => {
            handle(undefined, response.data);
          })
          .catch(error => {
            handle(error);
          });
      } else {
        res(value);
      }
    });
  });
}

function getCommit(owner, repo, sha) {
  var key = `${owner}/${repo}/commits/${sha}`;

  return new Promise((res, rej) => {
    var handle = handler(res, rej, {
      key: key,
      ttl: 600
    });

    cache.get(key, (err, value) => {
      if (!value) {
        github()
          .git
          .getCommit({
            owner: owner,
            repo: repo,
            commit_sha: sha
          })
          .then(response => {
            handle(undefined, response.data);
          })
          .catch(error => {
            handle(error);
          });
      } else {
        res(value);
      }
    });
  });
}

function getCommits(owner, repo, path) {
  var key = `${owner}/${repo}/commits/${path}`;

  return new Promise((res, rej) => {
    var handle = handler(res, rej, { key: key, ttl: 60 });

    cache.get(key, (err, value) => {
      if (!value) {
        github()
          .repos
          .listCommits({
            owner: owner,
            repo: repo,
            path: path
          })
          .then(response => {
            handle(undefined, response.data);
          })
          .catch(error => {
            handle(error);
          });
      } else {
        res(value);
      }
    })
  });
}

function getFile(owner, repo, path) {
  return getRepoTree(owner, repo).then(({tree}) => {
    return _.find(tree, {
      path: path
    });
  });
}

function getText(owner, repo, sha) {
  return getBlob(owner, repo, sha).then(response => {
    return Buffer.from(response.content, 'base64').toString('utf8');
  });
}

function getTextFile(owner, repo, path, defaultContent) {
  return getFile(owner, repo, path).then(blob => {
    if (!blob && defaultContent) {
      return defaultContent;
    } else if (!blob) {
      throw new Error(`${path} does not exist in ${owner}/${repo}.`);
    }

    return getText(owner, repo, blob.sha);
  });
}

function getRepoTree(owner, repo) {
  var key = `${owner}/${repo}/tree`;

  return new Promise((res, rej) => {
    var handle = handler(res, rej, {
      key: key,
      ttl: 60
    });

    cache.get(key, (err, value) => {
      if (!value) {
        github()
          .git
          .getTree({
            owner: owner,
            repo: repo,
            tree_sha: 'master',
            recursive: 1
          })
          .then(response => {
            handle(undefined, response.data);
          })
          .catch(error => {
            handle(error);
          });
      } else {
        res(value);
      }
    });
  });
}

function getUserData(owner) {
  var key = `${owner}/userdata`;

  return new Promise((res, rej) => {
    var handle = handler(res, rej, {
      key: key,
      ttl: 600
    });

    cache.get(key, (err, value) => {
      if (!value) {
        github()
          .users
          .getByUsername({
            username: owner
          })
          .then(response => {
            handle(undefined, response.data);
          })
          .catch(error => {
            handle(error);
          });
      } else {
        res(value);
      }
    });
  });
}

function handler(resolve, reject, {key, ttl}) {
  return (err, res) => {
    if (err != null) {
      console.error(err);
      console.error(err.stack);
      reject(err);
    } else {
      if (key) cache.set(key, res, ttl);
      resolve(res);
    }
  }
}

function renderMarkdown(owner, repo, id, text, mode) {
  var key = `${owner}/${repo}/${id}`;

  return new Promise((res, rej) => {
    cache.get(key, (err, value) => {
      var handle = handler(res, rej, {
        key: key,
        ttl: 600
      });

      if (!value) {
        github()
          .markdown
          .render({
            text: text,
            mode: mode || 'markdown',
            context: `${owner}/${repo}`
          })
          .then(response => {
            handle(undefined, response.data);
          })
          .catch(error => {
            handle(error);
          });
      } else {
        res(value);
      }
    });
  });
}

module.exports = {
    getBlob: getBlob,
    getCommit: getCommit,
    getCommits: getCommits,
    getFile: getFile,
    getText: getText,
    getTextFile: getTextFile,
    getRepoTree: getRepoTree,
    getUserData: getUserData,
    renderMarkdown: renderMarkdown
};
