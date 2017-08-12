const { request } = require('graphql-request');
const ENDPOINT = 'http://localhost:8000/graphql'

async function createKode(input) {
  let res = await request(
    ENDPOINT,
    `mutation CreateKode($input: CreateKodeInput) {
      createKode(input: $input) {
        id
      }
    }`,
    { input }
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
  createKode
}