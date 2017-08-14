const { request } = require('graphql-request');
const ENDPOINT = 'https://api.graph.cool/simple/v1/cj6bmounb0n6e010190mz5297'

// ;) 이 코드 돌아봐야겠다 (#3ce7466)
async function createKodes(input) {
  return await request(
    ENDPOINT,
    `mutation CreateKodes($input: CreateKodesInput) {
      createKodes(input: $input) {
        id
      }
    }`,
    { input }
  )
}

async function createProject(input) {
  let inputstr = Object.keys(input).map(key => `${key}: ${JSON.stringify(input[key])}`).join(" ")

  return await request(
    ENDPOINT, 
    `mutation {
      createProject(${inputstr}) {
        id,
        name
      }
    }`, 
    { input }
  );
}

module.exports = {
  createProject,
  createKodes
}