'use strict';

import _ from 'lodash';
import { GraphQLList as List, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';

import { getFile } from '../../core/github';
import { renderPost } from '../../core/posts';
import PostItemType from '../types/PostType';

const post = {
  type: PostItemType,
  args: {
    owner: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    },
    key: {
      type: new NonNull(StringType)
    },
  },
  resolve(request, {owner, repo, key}) {
    return getFile(owner, repo, key).then(post => {
      return renderPost(owner, repo, post);
    });
  }
};

export default post;
