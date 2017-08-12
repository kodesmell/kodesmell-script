const program = require('commander');
const path = require('path')
const fs = require('fs')

const finds = []

const parser = function kodeParser(file) {
  let text = fs.readFile(file, 'utf-8', (err, text) => {
    if (err) {
      console.error(err);
      process.exit(0);
    }

    let lines = text.split(`\n`)
    let badcode = false
    let res = []

    for (let i = 0; i < lines.length; i++) {
      let contains = /:\)/.test(lines[i])
      if (contains) {
        if (badcode) {
          
          badcode = false;
        } else {
          badcode = true
        }
        badcode = true;
      } else {
        if (badcode) {
          res.push(lines[i])
        }
      }
    }
  })
}

const recursive = function recursiveFinder(root) {
  console.log(`searching ${root}...`)
  fs.lstat(root, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(0);
    }

    const isDir = stats.isDirectory()
    const isFile = stats.isFile()
    
    if (isFile) {
      parser(root)
    } else {
      fs.readdir(root, (err, results) => {
        if (err) {
          console.error(err);
          process.exit(0);
        }

        results.map(r => recursive(path.resolve(root, r)))
      })
    }
  })
}

program
  .arguments('<input>')
  .action((input) => {
    const root = path.resolve(input)
    recursive(root)
  })
  .parse(process.argv);


