export class BlogPost {

    constructor(
        public readonly id: string, 
        public readonly title: string, 
        public readonly topics: Array<string>, 
        public readonly author: string, 
        
        public readonly publishedDate: string,
        public readonly publishedTime: number,
        public readonly lastModifiedDate: string,
        public readonly contentSnippet: string, 
        public readonly content: string) {

    }

}