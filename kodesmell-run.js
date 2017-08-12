const program = require('commander');
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')
const { flatten } = require('ramda')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const readfile = promisify(fs.readFile)
const lstat = promisify(fs.lstat)

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

      console.log(`${chalk.blue('[Smell]')} ${file} at line number ${i}.`);

      // Hashfinder
      let message, hash
      let hashFound = /\(#.+\)/.exec(line) // null | array

      if (hashFound) {
        hash = hashFound[0].slice(1, -1);
        message = line.slice(where + 2, -hashFound[0].length)
      } else {
        message = line.slice(where + 2)
      }

      return {
        hash,
        fileName: file,
        lineNumber: i,
        line,
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

program
  .arguments('<input>')
  .action(async (input) => {
    const root = path.resolve(input)
    const result = await recursive(root)
    console.log(flatten(result))
  })
  .parse(process.argv);

// JSON Format
/**
 * fileName: "",
 * lineNumber: "",
 * code: "",
 * message: ""
 */

