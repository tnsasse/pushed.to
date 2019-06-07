const Promise = require('bluebird');
const fetch = require('node-fetch');
const host = require('../config').host;

fetch.Promise = Promise;
fetch.Response.Promise = Promise;

function localUrl(url) {
  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `http://${host}${url}`;
}

function localFetch(url, options) {
  return fetch(localUrl(url), options);
}

module.exports = localFetch;
