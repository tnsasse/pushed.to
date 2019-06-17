const _ = require('lodash');
const Base64 = require('js-base64').Base64;
const Promise = require('bluebird');
const GraphQL = require('graphql');
const RenderType = require('../types/RenderType').RenderType;
const GitHub = require('../../core/github');
const Query = require('../../core/fetch-graphql');

const jade = require('pug');

const List = GraphQL.GraphQLList;
const StringType = GraphQL.GraphQLString;
const NonNull = GraphQL.GraphQLNonNull;

const getTextFile = GitHub.getTextFile;

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
      })
      .catch(error => {
        console.log(error);
      });
  }
};

module.exports = render;
