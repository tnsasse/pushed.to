const Base64 = require('js-base64').Base64;
const s = require('stripmargin');

const blogQueryFactory = require('./blog');
const postsQueryFactory = require('./posts');

module.exports = (owner, project, page = 1) => {
    const blogQuery = blogQueryFactory(owner, project);
    const postsQuery = postsQueryFactory(owner, project, page);

    return s.stripMargin(
        `{
        |  render(
        |    owner: "${owner}",
        |    repo: "${project}",
        |    queries: [
        |      "${Base64.encode(blogQuery)}",
        |      "${Base64.encode(postsQuery)}"
        |    ]
        |    templates: [
        |      ".template/posts.jade",
        |      ".template/index.jade"
        |    ]
        |    selects: [
        |      "blog.title",
        |      "blog.template.styles"
        |    ]) {
        |      data,
        |      result
        |    }
        }`);
}