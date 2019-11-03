import _ from 'lodash';

import { BlogPost } from './BlogPost';

export class BlogConfiguration {

    constructor(
        private readonly dateFormat$: string,
        public readonly postsPerPage: number, 
        public readonly analyticsId: string, 
        public readonly disqusId: string) {

    }

    get dateFormat() {
        return this.dateFormat$ || 'MMMM DD, YYYY';
    }

}

export class UserDetails {

    constructor(
        public readonly name: string,
        public readonly location: string, 
        public readonly company: string,
        public readonly url: string,
        public readonly avatar: string,
        public readonly github: string,
        public readonly linkedin: string, 
        public readonly twitter: string) {
        
    }

}

export class Blog {

    constructor(
        public readonly username: string, 
        public readonly repository: string, 
        public readonly title: string, 
        public readonly description: string, 
        public readonly topics: Array<string>,
        public readonly config: BlogConfiguration, 
        public readonly owner: UserDetails,
        public readonly blogPosts: Array<BlogPost> = []) {

    }

    public copyWith(modifyObject: { [P in keyof Blog]?: Blog[P] }): Blog {
        return Object.assign(Object.create(Blog.prototype), { ...this, ...modifyObject });
    }

    addPost(post: BlogPost): Blog {
        const blogPosts: Array<BlogPost> = _([])
            .concat(this.posts())
            .concat([ post ])
            .sortBy([ 'published' ])
            .reverse()
            .value();

        return this.copyWith({ blogPosts });
    }

    post(id: string): BlogPost {
        return _.find(this.posts(), { id })
    }

    posts(topic?: string): Array<BlogPost> {
        if (topic) {
            return _.filter(this.posts(), post => {
                const topics = _.get(post, 'topics', []);
                return _.indexOf(topics, topic) > -1;
            });
        } else {
            return this.blogPosts;
        }
    }

}

export class BlogViewModel {

    constructor(
        readonly blog: Blog,
        readonly posts: Array<BlogPost>,
        readonly page: number,
        readonly pages: number
    ) {

    }
}

export class BlogPostViewModel {

    constructor(
        readonly blog: Blog,
        readonly post: BlogPost
    ) {

    }

}