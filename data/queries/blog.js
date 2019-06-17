const s = require('stripmargin');

module.exports = (owner, repo) => s.stripMargin(
    `{
    |  blog(owner: "${owner}", repo: "${repo}") {
    |    title,
    |    description,
    |    topics,
    |    url,
    |    analyticsId,
    |    baseUrl,
    |    user,
    |    repo,
    |    owner {
    |      name,
    |      url,
    |      company,
    |      location,
    |      avatar,
    |      twitter,
    |      linkedin,
    |      github
    |    }
    |  }
    }`);