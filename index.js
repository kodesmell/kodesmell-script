#!/usr/bin/env node

const program = require('commander');

program
  .arguments('<file>')
  .command('install [name]', 'install one or more packages')
  .command('run [folder|file]', 'Detect bad code comments in files or folder recursively')
  .parse(process.argv);
  // .option('-u, --username <username>', 'The user to authenticate as')
  // .option('-p, --password <password>', 'The user\'s password')