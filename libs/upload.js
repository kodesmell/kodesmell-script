const { request } = require('graphql-request');

// request
//   .post('http://localhost:8000/graphql')
//   .set()

module.exports = function upload(variables) {
  request(
    'http://localhost:8000/graphql',
    `mutation NewCode($input: [CodeInput]) {
      newCode(input: $input) {
        id
      }
    }`,
    {
      input: variables
    }
  ).then(data => console.log(data))
}