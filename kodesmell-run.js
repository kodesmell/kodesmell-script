const program = require('commander');
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')
const { flatten } = require('ramda')
const { promisify } = require('util')
const crypto = require('crypto')
const co = require('co')
const prompt = require('co-prompt')

const upload = require('./libs/upload')

const readdir = promisify(fs.readdir)
const readfile = promisify(fs.readFile)
const lstat = promisify(fs.lstat)
const writeFile = promisify(fs.writeFile)

const finds = []

const parser = async function kodeParser(file) {
  try {
    let text = await readfile(file, 'utf-8');
    let lines = text.split(`\n`)
    let badcode = false
    let res = []

    let trues = lines.map((line, i) => {
      let isComment = /\/\//.test(line)
      if (!isComment) return false;

      let where = line.indexOf(';)')
      if (where < 3) return false;

      const success = chalk.red.bold
      console.log(`${success('[Kodesmell]')} ${chalk.hex('#08f').underline(file)} at line number ${i}.`);

      // Hashfinder
      let message, hash
      let hashFound = /\(#.+\)/.exec(line) // null | array

      if (hashFound) {
        hash = hashFound[0].slice(2, -1);
        message = line.slice(where + 2, -hashFound[0].length)
      } else {
        message = line.slice(where + 2)
      }

      return {
        hash,
        fileName: file,
        lineNumber: i,
        line,
        code: text,
        message: message.trim()
      }

      return false;
    }).filter(Boolean);
    
    return trues;

  } catch(err) {
    console.error(err);
    process.exit(0);
  }
}

const recursive = async function recursiveFinder(root) {
  const info = chalk.hex('#aaa')(`searching in ${root}`)
  // console.log(info)

  try {
    let stats = await lstat(root);

    if (stats.isDirectory()) {
      let paths = await readdir(root)
      let results = paths.map(p => recursive(path.resolve(root, p)))
      return await Promise.all(results)
    } else if (stats.isFile()) {
      return await parser(root)
    }

  } catch(err) {
    console.error(err);
    process.exit(0);
  }
}

const inject = async function hashInjector(arr) {
  let hashes = arr.reduce((hashes, json) => {
    if (json.hash) {
      hashes[json.hash] = true
    }
    return hashes;
  }, {})

  let injected = arr.map(async (json) => {
    if (json.hash) return json;

    let { line, code, fileName, lineNumber } = json
    let hash = crypto.randomBytes(20).toString('hex').slice(0, 7);

    while (hashes[hash]) {
      hash = crypto.randomBytes(20).toString('hex').slice(0, 7);
    }

    let lines = [...code.split('\n')]
    lines[lineNumber] = line + ` (#${hash})`

    let newCode = lines.join('\n')

    await writeFile(fileName, newCode)
    return Object.assign({}, json, { hash });
  })

  return await Promise.all(injected);
}

program
  .arguments('<input>')
  .action(async (input) => {
    console.log('Start processing your code')
    const root = path.resolve(input)
    const result = await recursive(root)
    const parsed = flatten(result)
    
    try {
      let finals = await inject(parsed)
      
      console.log('We will push results to kodesmell!')
      upload(finals)
    } catch(err) {
      console.error(`injection failed!`);
      console.error(err);
      process.exit(0);
    }

    // co(function *() {
    //   let email = yield prompt('email: ');
    //   let password = yield prompt.password('password: ');
    //   console.log(email, password)
    // });

  })
  .parse(process.argv);

// JSON Format
/**
 * fileName: "",
 * lineNumber: "",
 * code: "",
 * hash,
 * message: ""
 */


