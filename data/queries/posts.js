const s = require('stripmargin');

module.exports = (owner, project, page = 1) => s.stripMargin(
    `{
    |  posts(owner: "${owner}", repo: "${project}", page: ${page}) {
    |    posts {
    |      key,
    |      title,
    |      topics,
    |      link,
    |      author,
    |      publishedDate,
    |      contentSnippet
    |    },
    |    pages,
    |    page,
    |    nextUrl,
    |    prevUrl
    |  }
    }`)