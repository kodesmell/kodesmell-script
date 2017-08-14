const { request } = require('graphql-request');
const ENDPOINT = 'http://localhost:8000/graphql'

// ;) 이 코드 돌아봐야겠다 (#3ce7466)
async function createKodes(payload) {
  let res = await request(
    ENDPOINT,
    `mutation CreateKodes($payload: CreateKodesPayload) {
      createKodes(payload: $payload) {
        id
      }
    }`,
    { payload }
  )
  console.log(res)
}

async function createProject(input) {
  const payload = {
    query: `mutation CreateProject($input: CreateProjectInput) {
      createProject(input: $input) {
        id
      }
    }`,
    variables: { input }
  }

  let res = await request(ENDPOINT, payload.query, payload.variables)
}

module.exports = {
  createProject,
  createKodes
}