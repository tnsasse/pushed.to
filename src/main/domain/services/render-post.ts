import _ from 'lodash';
import Moment from 'moment';

import { Blog } from '../entities/Blog';
import { BlogPost } from '../entities/BlogPost';
import { GitHubRepositories } from '../ports/GitHubRepositories';

function getTopics(content: string): { topics: Array<string>, content: string } {
  let allLines: Array<string> = content.split("\n");
  let finalLines: Array<string> = [];
  let inTopics: boolean = false;
  let topics: Array<string> = [];

  _.forEach(allLines, line => {
    if (inTopics) {
      if (line.startsWith("```")) {
        inTopics = false;
      } else {
        const newTopics = _.map(line.split(","), t => t.trim());
        topics = _.concat(topics, newTopics);
      }
    } else {
      if (line.startsWith("```topics")) {
        inTopics = true;
      } else {
        finalLines.push(line);
      }
    }
  });

  return { topics, content: _.join(finalLines, '\n') };
}

function splitContentAndSnippet(owner: string, repo: string, postId: string, content: string): { content: string, contentSnippet: string } {
    let contentSnippet = content;
    let split = content.indexOf('---');

    if (split > -1) {
      contentSnippet = _.trim(content.substr(0, split), '\n');
      content = _.trim(content.substr(split + 4), '\n');
    }

    return {
        content,
        contentSnippet
    }
}

export default async (owner: string, repo: string, post: any, git: GitHubRepositories, blog: Blog): Promise<BlogPost> => {
    const postText = await git.getText(owner, repo, post.sha);
    const commits = await git.getCommits(owner, repo, post.path);

    const commit = _.last(commits);

    const text = _.trim(postText.substr(postText.indexOf('\n') + 1), '\n');
    const { topics, ...remainingFromTopics } = getTopics(text);
    const { content, contentSnippet } = splitContentAndSnippet(owner, repo, post.path, remainingFromTopics.content);

    const contentRendered = await git.renderMarkdown(owner, repo, content);
    const contentSnippetRendered = await git.renderMarkdown(owner, repo, contentSnippet);
    const postDate = new Date(commit.commit.author.date);

    const blogPost = new BlogPost(
        post.path,
        _.trim(_.trimStart(_.head(_.split(postText, '\n')), '#')),
        topics,
        commit.commit.author.name,
        Moment(postDate).format(blog.config.dateFormat),
        postDate.getTime() * 1,
        Moment(new Date(_.first(commits).commit.author.date)).format(blog.config.dateFormat),
        String(contentSnippetRendered),
        String(contentRendered));

    return blogPost;
}