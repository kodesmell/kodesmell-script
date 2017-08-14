const program = require('commander');
const path = require('path')
const chalk = require('chalk')
const fs = require('graceful-fs')
const { flatten } = require('ramda')
const { promisify } = require('util')
const crypto = require('crypto')
const co = require('co')
const prompt = require('co-prompt')

const { createKodes } = require('./lib/upload')

const minimist = require('minimist')

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const lstat = promisify(fs.lstat)
const writeFile = promisify(fs.writeFile)
const PROJECT_ROOT = __dirname
const KODESMELL_PROJECT_NAME = PROJECT_ROOT.split(path.sep).pop()
const KODESMELL_ROOT = path.resolve(PROJECT_ROOT, '.kodesmell')
const KODESMELL_CONFIG = path.resolve(KODESMELL_ROOT, 'kodesmell.json')
const KODESMELL_HASHKEY_CACHE = path.resolve(KODESMELL_ROOT, 'kodesmell_hashes.txt')
const finds = []

const configs = require('./lib/config')

const parser = async function kodeParser(file, project) {
  try {
    let text = await readFile(file, 'utf-8');
    let lines = text.split(`\n`)
    let badcode = false
    let res = []

    let trues = lines.map((line, i) => {
      let isComment = /\/\//.test(line)
      if (!isComment) return false;

      let where = line.indexOf(';)')
      if (where < 3) return false;

      const success = chalk.red.bold
      // console.log(`${success('[Smells]')} ${chalk.green.underline(file)}@${i}.`);

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
        project,
        message: message.trim(),
      }

      return false;
    }).filter(Boolean);
    
    return trues;

  } catch(err) {
    console.error(err);
    process.exit(0);
  }
}

async function search(root, project) {
  const info = chalk.hex('#aaa')(`searching in ${root}`)
  
  try {
    let stats = await lstat(root);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(info);
    
    if (stats.isDirectory()) {
      let paths = await readdir(root)
      let results = paths.map(p => search(path.resolve(root, p)))
      return await Promise.all(results)
    } else if (stats.isFile()) {
      return await parser(root, project)
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

async function readJson() {
  try {
    let json = await readFile(configs.KODESMELL_JSON, 'utf-8')
    return JSON.parse(json);

  } catch(e) {
    if (e.code === 'ENOENT') {
      console.error(`cannot run 'Kodesmell' in this project. You should run 'kodesmell init' first.`);
      
      process.exit(0);
    } else {
      console.error(e);
      process.exit(0);
    }
  }
}

(async function main() {
  const argv = minimist(process.argv.slice(2))
  let source = argv._[0]

  if (!source) {
    source = '.' // Default source is the root.
  }

  source = path.resolve(source)
  let { project } = await readJson()
  let found = flatten(await search(source, project))
  process.stdout.write('\n')

  let kodes = await inject(found)
  
  await createKodes({ kodes })
  console.log('Created Kode!')
})()

