import _ from 'lodash';
import { BlogPost } from '../entities/BlogPost'
import { BlogConfiguration, UserDetails, Blog, BlogViewModel, BlogPostViewModel } from '../entities/Blog';
import { BlogRepository } from '../ports/BlogRepository'
import { GitHubRepositories } from '../ports/GitHubRepositories'

import renderPost from '../services/render-post';
import withRetry from '../services/retry';

export class API {
    
    constructor(
        private readonly blogs: BlogRepository, 
        private readonly git: GitHubRepositories) {
    }

    async initialize(): Promise<void> {
        const blogs = await this.blogs.initialBlogs();
        return this.fetchBlogs(blogs);
    }

    async exists(username: string, repository: string): Promise<boolean> {
        return this.git.getTextFile(username, repository, '.blog')
            .then(config => true)
            .catch(error => false);
    }

    async fetched(username: string, repository: string): Promise<boolean> {
        return this.blogs.hasBlog(username, repository);
    }

    async fetch(username: string, repository: string): Promise<void> {
        if (await this.blogs.isFetching(username, repository)) {
            return Promise.resolve();
        }

        await this.blogs.markFetching(username, repository);

        try {
            const { tree } = await withRetry(() => this.git.getRepositoryTree(username, repository));
            const user = await withRetry(() => this.git.getUserData(username));
            const config = JSON.parse(await withRetry(() => this.git.getTextFile(username, repository, '.blog')));

            const userDetails = new UserDetails(
                user.name,
                user.location,
                user.company,
                user.blog,
                user.avatar_url,
                user.html_url,
                _.get(config, 'social.linkedin'), 
                _.get(config, 'social.twitter'));

            const blogConfig = new BlogConfiguration(
                _.get(config, 'dateFormat', 'MMMM DD, YYYY'),
                _.get(config, 'postsPerPage', 3),
                _.get(config, 'analyticsId'),
                _.get(config, 'disqusId'));

            const topics = _.get(config, 'topics', []);

            let blog = new Blog(username, repository, config.title, config.description, topics, blogConfig, userDetails);

            const blogPosts: Array<BlogPost> = await Promise.all(_(tree)
                .filter(item => _.endsWith(item.path, '.md') && item.type === 'blob' && !_.endsWith(item.path, 'README.md'))
                .map(post => withRetry(() => renderPost(username, repository, post, this.git, blog)))
                .value());

            blog = blog.copyWith({ blogPosts })
            this.blogs.saveBlog(blog);

            console.log(`Saved blog ${blog.username}/${blog.repository}`);
        } finally {
            await this.blogs.markFetched(username, repository);
        }

        return Promise.resolve();
    }

    async fetchAll(): Promise<void> {
        const blogs = await this.blogs.allBlogs();
        return this.fetchBlogs(blogs);
    }

    private async fetchBlogs(blogs: Array<{username: string, repository: string}>): Promise<void> {
        if (blogs.length == 0) {
            return Promise.resolve();
        } else {
            const blog = _.head(blogs);
            const exists = await this.exists(blog.username, blog.repository)

            if (!exists) {
                await this.blogs.removeBlog(blog.username, blog.repository);
                console.log(`Removed blog ${blog.username}/${blog.repository} ...`);
            } else {
                console.log(`Fetching blog ${blog.username}/${blog.repository} ...`);
                await this.fetch(blog.username, blog.repository);
                console.log(`Fetched blog ${blog.username}/${blog.repository} ...`);
            }

            return this.fetchBlogs(_.tail(blogs));
        }
    }

    async post(username: string, repository: string, post: string): Promise<BlogPostViewModel> {
        const blog = await this.blogs.getBlog(username, repository)
        return new BlogPostViewModel(blog, blog.post(post));
    }

    async posts(username: string, repository: string, page: number = 1, topic?: string): Promise<BlogViewModel> {
        const blog = await this.blogs.getBlog(username, repository)
        const allPosts = blog.posts(topic);
        const ppp = blog.config.postsPerPage;
        const posts = _.slice(_.orderBy(allPosts, ['publishedTime'], ['desc']), (page - 1) * ppp, page * ppp);

        return new BlogViewModel(blog, posts, page, Math.ceil(allPosts.length / ppp));
    }

}