const { request } = require('graphql-request');
const ENDPOINT = 'http://localhost:8000/graphql'

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
  return await request(
    ENDPOINT, 
    `mutation($input: CreateProjectInput) {
      createProject(input: $input) {
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