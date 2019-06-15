const s = require('stripmargin');

module.exports = (owner, repo) => s.stripMargin(
    `{
    |  blog(owner: "${owner}", repo: "${repo}") {
    |    title,
    |    url,
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
    |      github
    |    }
    |  }
    }`);