'use strict';

import _ from 'lodash';
import { Base64 } from 'js-base64';
import jade from 'jade';
import Promise from 'bluebird';
import { GraphQLList as List, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';

import RenderType from '../types/RenderType';
import Query from '../../core/fetch-graphql';
import { getTextFile } from '../../core/github';

const render = {
  type: RenderType,

  args: {
    owner: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    },
    queries: {
      type: new NonNull(new List(StringType))
    },
    templates: {
      type: new NonNull(new List(StringType))
    },
    selects: {
      type: new NonNull(new List(StringType))
    }
  },

  resolve(request, {owner, repo, queries, templates, selects}) {
    return Promise.join(
      Promise.all(_.map(templates, file => getTextFile(owner, repo, file))),
      Promise.all(_.map(queries, (queryEncoded) => {
        const query = Base64.decode(queryEncoded);
        return Query(query);
      })), (templates, results) => {
        const data = _.reduce(results, (collect, result) => {
          return _.assign({}, collect, result.data);
        }, {});

        return {
          data: Base64.encode(JSON.stringify(_.reduce(selects, (collect, key) => {
            _.set(collect, key, _.get(data, key));
            return collect;
          }, { }))),
          result: _.reduce(templates, (collect, template) => {
            return _.assign({}, collect, {
              content: jade.render(template, collect)
            });
          }, data).content
        };
      }).catch(e => {
      console.log(e);
      console.error(e);
      console.log(e.stack);
      return {
        data: {},
        result: '<div>Error</div>'
      };
    });
  }
};

export default render;
