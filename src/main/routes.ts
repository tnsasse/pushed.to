import _ from 'lodash';
import cron from 'cron';
import express from 'express';
import path from 'path';

import config from './config';
import { API } from './domain/api';
import { DomainError } from './domain/entities/DomainError';
import { InMemoryBlogRepository } from './adapters/InMemoryBlogRepository';
import { GitHubRepositories } from './domain/ports/GitHubRepositories';

const blogRepository = new InMemoryBlogRepository();
const ghRepositories = new GitHubRepositories(config.github.client_id, config.github.client_secret);
const api = new API(blogRepository, ghRepositories);

const staticContent = async (req: express.Request, res: express.Response, contentType: string): Promise<void> => {
    const file = await ghRepositories.getRawFile(req.params.user, req.params.repository, req.url.substr(1));
    res.header('Content-Type', contentType);
    res.header('Content-Length', String(file.length));
    res.end(file);
}

const withErrorHandler = (promise: (req: express.Request, res: express.Response, next?: express.NextFunction) => Promise<any>) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    promise(req, res, next).catch(error => {
        if (error instanceof DomainError) {
            res.locals.message = error.message;
            res.locals.error = { status: error.status };

            res.status(error.status);
            res.render('error');
        } else {
            console.error(error);
            res.locals.message = 'Internal Server Error';
            res.locals.error = { status: 500 };

            res.status(500);
            res.render('error');
        }
    });
}

async function blogs(req: express.Request, res: express.Response): Promise<void> {
    const blogs = await blogRepository.allBlogs();
    res.json(blogs);
}

function updateProject(req: express.Request, res: express.Response): Promise<void> {
    api.fetch(req.params.user, req.params.repository);
    res.sendStatus(200);
    return Promise.resolve();
}

async function viewPost(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    if (_.endsWith(req.url, '.png')) {
        return staticContent(req, res, 'image/png');
    } else if (_.endsWith(req.url, '.jpg') || _.endsWith(req.url, '.jpeg')) {
        return staticContent(req, res, 'image/jpeg');
    } else if (_.endsWith(req.url, '.gif')) {
        return staticContent(req, res, 'image/gif');
    } else if (_.endsWith(req.url, '.bmp')) {
        return staticContent(req, res, 'image/bmp');
    } else {
        if (!_.endsWith(req.url, '.md')) {
            req.url = req.url + '.md';
        }

        const user = req.params.user;
        const repository = req.params.repository;
        const id = req.url.substr(1)
        const fetched = await api.fetched(user, repository);

        if (fetched) {
            const vm = await api.post(user, repository, id);
            const link = `/${user}/${repository}/posts/${id}`;
            const url = `/${user}/${repository}`;
            res.locals.blog = _.omit(_.assign({}, vm.blog, { url }), 'blogPosts');
            res.locals.post = _.assign({}, vm.post, { link });
    
            res.render('post')
        } else if (await api.exists(user, repository)) {
            api.fetch(user, repository);
            res.render('fetching');
        } else {
            res.locals.message = `No blog defined at ${user}/${repository}`;
            res.locals.error = { status: 404 };
    
            res.status(404);
            res.render('error');
        }
    }
}

async function viewPosts(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    if (!_.isUndefined(req.params.page) && _.isNaN(req.params.page)) {
        next();
    }

    const user = req.params.user;
    const repository = req.params.repository;
    const page = _.get(req, 'params.page', 1) * 1;
    const topic = _.get(req, 'params.topic');
    
    const fetched = await api.fetched(user, repository);

    if (fetched) {
        const vm = await api.posts(user, repository, page, topic)
        const url = `/${user}/${repository}`;
        let nextUrl: string = vm.page < vm.pages && `/${user}/${repository}/posts/${vm.page + 1}`;
        let prevUrl: string = vm.pages > 1 && `/${user}/${repository}/posts/${vm.page - 1}`;

        if (topic) {
            nextUrl = vm.page < vm.pages && `/${user}/${repository}/topics/${topic}/${vm.page + 1}`;
            prevUrl = vm.page > 1 && `/${user}/${repository}/topics/${topic}/${vm.page - 1}`;
        }

        const posts = _.map(vm.posts, post => {
            const link = `/${user}/${repository}/posts/${post.id}`;
            
            let contentSnippet = post.contentSnippet.replace(/href="([\.].+)"/g, path.normalize(`href="/${user}/${repository}/posts/${post.id}/../$1"`));
            contentSnippet = contentSnippet.replace(/src="([\.].+)"/g, path.normalize(`src="/${user}/${repository}/posts/${post.id}/../$1"`));

            return _.assign({}, post, { contentSnippet, link });
        });

        res.locals.blog = _.omit(_.assign({}, vm.blog, { url }), 'blogPosts');
        res.locals.posts = _.assign({}, vm, { posts, nextUrl, prevUrl });
        res.render('posts')
    } else if (await api.exists(user, repository)) {
        api.fetch(user, repository);
        res.render('fetching');
    } else {
        res.locals.message = `No blog defined at ${user}/${repository}`;
        res.locals.error = { status: 404 };

        res.status(404);
        res.render('error');
    }

    return Promise.resolve();
}

const router = express.Router();
router.get('/', (_, res) => res.render('index'));
router.get('/api/blogs', blogs);
router.get('/:user/:repository/update', withErrorHandler(updateProject));
router.get('/:user/:repository', withErrorHandler(viewPosts));
router.get('/:user/:repository/posts/:page', withErrorHandler(viewPosts));
router.get('/:user/:repository/topics/:topic', withErrorHandler(viewPosts));
router.get('/:user/:repository/topics/:topic/:page', withErrorHandler(viewPosts));
router.use('/:user/:repository/posts', withErrorHandler(viewPost));

new cron.CronJob('*/15 * * * *', function() {
    console.log("Update blogs ...")
    api.fetchAll();
}, null, true);

api.initialize();

export default router;