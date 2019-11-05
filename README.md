# pushed.to

A free &amp; open, code centric blogging platform: Write posts with Markdown. Push your blog to a GitHub repository. View and share your wisdom via `pushed.to/&lt;username&gt;/&lt;repo&gt;`

Visit [pushed.to](http://pushed.to) for more details.

## Contribute

[pushed.to](http://pushed.to) is licensed under [Apache 2.0](./LICENSE). Feedback, Pull-Requests and any other kind of contributions are very welcome.

### Getting Started

To work with the code. Execute the following steps:

```bash
$ git clone git@github.com:pushedto/pushed.to.git
$ cd pushed.to
$ npm install
$ npm run start:watch
```

This will start the local development server in watch-mode. If you want to test the app with proper communication to GitHub, you need to create your own client id and client secret for the GitHub API. You can do this within your [GitHub user settings](https://github.com/settings/applications/new). When you have a client id and client secret you might setup a short script (e.g. dev.sh) to start the development server as follows:

```sh
#!/bin/bash

export GH_CLIENT_ID="your client id"
export GH_CLIENT_SECRET="your client secret"

npm run start:watch
```

Then you can start your local development server with:

```bash
$ chmod +x dev.sh
$ ./dev.sh
```
