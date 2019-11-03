import _ from 'lodash';
import Octokit from '@octokit/rest';

export class GitHubRepositories {

    private github: Octokit

    constructor(clientId: string, clientSecret: string) {
        this.github = new Octokit({
            auth: {
              clientId: clientId,
              clientSecret: clientSecret
            },
            userAgent: 'pushed.to',
            log: {
                debug: () => {},
                info: () => {},
                warn: console.warn,
                error: console.error
              },
            
            request: {
                agent: undefined,
                timeout: 5000
            }
          });
    }

    async getBlob(owner: string, repo: string, sha: string): Promise<Octokit.GitGetBlobResponse> {
        const response = await this
            .github
            .git
            .getBlob({ owner, repo, file_sha: sha });

        return response.data;
    }

    async getCommit(owner: string, repo: string, sha: string): Promise<Octokit.GitGetCommitResponse> {
        const response = await this
            .github
            .git
            .getCommit({ owner, repo, commit_sha: sha });
        
        return response.data;
    }

    async getCommits(owner: string, repo: string, path: string): Promise<Octokit.ReposListCommitsResponse> {
        const response = await this
            .github
            .repos
            .listCommits({ owner, repo, path });
        
        return response.data;
    }

    async getFile(owner: string, repo: string, path: string): Promise<any> {
        return await this
            .getRepositoryTree(owner, repo)
            .then(({tree}) => _.find(tree, { path }));
    }

    async getText(owner: string, repo: string, sha: string): Promise<string> {
        return await this
            .getBlob(owner, repo, sha)
            .then(response => Buffer.from(response.content, 'base64').toString('utf8'));
    }

    async getBytes(owner: string, repo: string, sha: string): Promise<Buffer> {
        return await this
            .getBlob(owner, repo, sha)
            .then(response => Buffer.from(response.content, 'base64'));
      }

    async getTextFile(owner: string, repo: string, path: string, defaultContent?: string): Promise<string> {
        return await this.getFile(owner, repo, path).then(blob => {
          if (!blob && defaultContent) {
            return defaultContent;
          } else if (!blob) {
            throw new Error(`${path} does not exist in ${owner}/${repo}.`);
          } else {
              return this.getText(owner, repo, blob.sha);
          }
        });
    }

    async getRawFile(owner: string, repo: string, path: string) {
        return this.getFile(owner, repo, path).then(blob => {
           if (!blob) {
             throw new Error(`${path} does not exist in ${owner}/${repo}.`);
           } else {
              return this.getBytes(owner, repo, blob.sha);
           }
        });
    }

    async getUserData(owner: string): Promise<Octokit.UsersGetByUsernameResponse> {
        const response = await this
            .github
            .users
            .getByUsername({ username: owner })

        return response.data
    }

    async renderMarkdown(owner: string, repo: string, text: string, mode: 'markdown' | 'gfm' = 'markdown'): Promise<Octokit.MarkdownRenderResponse> {
        const response = await this
            .github
            .markdown
            .render({ text, mode, context: `${owner}/${repo}`});

        return response.data
    }

    async getRepositoryTree(owner: string, repo: string): Promise<any> {
        const response = await this
            .github
            .git
            .getTree({ owner, repo, tree_sha: 'master', recursive: 1 });

        return response.data;
    }

}