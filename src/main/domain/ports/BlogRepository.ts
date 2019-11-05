import { Blog } from '../entities/Blog';

export interface BlogRepository {

    allBlogs(): Promise<Array<{ username: string, repository: string }>>

    initialBlogs(): Promise<Array<{ username: string, repository: string }>>

    hasBlog(username: string, repository: string): Promise<boolean>;

    isFetching(username: string, repository: string): Promise<boolean>;

    getBlog(username: string, repository: string): Promise<Blog>;

    markFetching(username: string, repository: string): Promise<void>;

    markFetched(username: string, repository: string): Promise<void>;

    saveBlog(blog: Blog): Promise<void>;

    removeBlog(username: string, repository: string): Promise<void>;

}