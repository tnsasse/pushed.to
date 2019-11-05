import _ from 'lodash';
import { Blog } from  '../domain/entities/Blog'
import { DomainError } from  '../domain/entities/DomainError'
import { BlogRepository } from  '../domain/ports/BlogRepository'

export class InMemoryBlogRepository implements BlogRepository {

    private blogs: Map<string, Blog>

    private fetching: Array<string>;

    constructor() {
        this.blogs = new Map();
        this.fetching = [];
    }

    private asObj(id: string): { username: string, repository: string } {
        const values = _.split(id, '/');
        return { username: values[0], repository: values[1] };
    }

    allBlogs(): Promise<Array<{ username: string, repository: string}>> {
        return Promise.resolve(_.map(Array.from(this.blogs.keys()), this.asObj));
    }

    initialBlogs(): Promise<Array<{ username: string, repository: string}>> {
        return Promise.resolve([ { username: 'cokeSchlumpf', repository: 'rethink-it' }, { username: 'cokeSchlumpf', repository: 'doo'} ]);
    }

    isFetching(username: string, repository: string): Promise<boolean> {
        if (_.indexOf(this.fetching, `${username}/${repository}`) > -1) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    getBlog(username: string, repository: string): Promise<Blog> {
        if (this.blogs.has(`${username}/${repository}`)) {
            return Promise.resolve(this.blogs.get(`${username}/${repository}`));
        } else {
            return Promise.reject(new DomainError(`No repository found at ${username}/${repository}`, 404));
        }
    } 
    
    hasBlog(username: string, repository: string): Promise<boolean> {
        return Promise.resolve(this.blogs.has(`${username}/${repository}`));
    }

    markFetching(username: string, repository: string): Promise<void> {
        this.fetching = _.uniq(_.concat(this.fetching, `${username}/${repository}`));
        return Promise.resolve();
    }

    markFetched(username: string, repository: string): Promise<void> {
        this.fetching = _.filter(this.fetching, key => key !== `${username}/${repository}`);
        return Promise.resolve();
    }

    removeBlog(username: string, repository: string): Promise<void> {
        this.blogs.delete(`${username}/${repository}`)
        return Promise.resolve();
    }
    
    saveBlog(blog: Blog): Promise<void> {
        this.blogs.set(`${blog.username}/${blog.repository}`, blog);
        return Promise.resolve();
    }

}