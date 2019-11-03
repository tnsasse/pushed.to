import { Blog } from '../entities/Blog';

export interface BlogRepository {

    hasBlog(username: string, repository: string): Promise<boolean>;

    isFetching(username: string, repository: string): Promise<boolean>;

    getBlog(username: string, repository: string): Promise<Blog>;

    markFetching(username: string, repository: string): Promise<void>;

    markFetched(username: string, repository: string): Promise<void>;

    saveBlog(blog: Blog): Promise<void>;

}