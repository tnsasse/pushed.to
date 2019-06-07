const fetch = require('./fetch');

module.exports = (request) => {
  return fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: request,
    }),
    credentials: 'include',
  }).then(response => {
    if (response.status !== 200) {
      console.error(`Unable to fetch data, response code ${response.status}.`);
      throw new Error(response.statusText);
    } else {
      return response.json();
    }
  });
}
