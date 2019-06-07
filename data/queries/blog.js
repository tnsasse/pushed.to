'use strict';

import _ from 'lodash';
import Promise from 'bluebird';
import { GraphQLList as List, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';

import BlogType from '../types/BlogType';
import { host } from '../../config';
import { getRepoTree, getTextFile, getUserData } from '../../core/github';

const blog = {
  type: BlogType,

  args: {
    owner: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    }
  },

  resolve(request, {owner, repo}) {
    return Promise.join(
      getRepoTree(owner, repo),
      getUserData(owner),
      getTextFile(owner, repo, '.blog'),
      ({tree}, user, pConfig) => {
        const config = JSON.parse(pConfig);

        return Promise.all(_.map(_.filter(tree, file => _.endsWith(file.path, '.css')), style => getTextFile(owner, repo, style.path))).then(styles => {
          return {
            title: config.title,
            url: `http://${host}/${owner}/${repo}`,
            baseUrl: `http://${host}`,
            user: owner,
            repo: repo,
            owner: {
              name: user.name,
              location: user.location,
              company: user.company,
              url: user.blog,
              avatar: user.avatar_url,
              twitter: config.twitter,
              github: user.html_url
            },
            template: {
              styles: styles,
              titles: _.map(config.staticTitles || [], (title, file) => {
                return {
                  file: file,
                  title: title
                }
              })
            }
          };
        });
      });

  }
};

export default blog;
