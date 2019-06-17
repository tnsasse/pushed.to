const s = require('stripmargin');

module.exports = (owner, project, page = 1, topic = undefined) => {
    if (topic) {
        filter = `owner: "${owner}", repo: "${project}", page: ${page}, topic: "${topic}"`
    } else {
        filter = `owner: "${owner}", repo: "${project}", page: ${page}`
    }

    query = s.stripMargin(
        `{
        |  posts(${filter}) {
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
        }`);

    return query;
};