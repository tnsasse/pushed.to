/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLSchema as Schema, GraphQLObjectType as ObjectType } from 'graphql';

import blog from './queries/blog';
import post from './queries/post';
import posts from './queries/posts';
import render from './queries/render';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      blog,
      post,
      posts,
      render
    }
  }),
});

export default schema;
