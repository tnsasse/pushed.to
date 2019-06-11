const github = require('../core/github');
const express = require('express');

const router = express.Router();

router.get('/:user/:project/tree', (req, res) => {
    github
        .getRepoTree(req.params.user, req.params.project)
        .then(response => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response, null, 2));
        });
});

router.use('/:user/:project/files', (req, res) => {
    github
        .getTextFile(req.params.user, req.params.project, req.url.substr(1))
        .then(response => {
            res.send(response);
        })
});

router.use('/:user/:project/commits', (req, res) => {
    github
        .getCommits(req.params.user, req.params.project, req.url)
        .then(response => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response, null, 2));
        })
});

router.get('/:user/:project/commit/:sha', (req, res) => {
    github
        .getCommit(req.params.user, req.params.project, req.params.sha)
        .then(response => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response, null, 2));
        })
});

router.get('/:user/:project/blob/:blob', (req, res) => {
    github
        .getBlob(req.params.user, req.params.project, req.params.blob)
        .then(response => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response, null, 2));
        });
});

router.get('/:user', (req, res) => {
    github
        .getUserData(req.params.user)
        .then(response => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response, null, 2));
        });
});

module.exports = router;