#!/usr/bin/env node

const program = require('commander');

program
  .arguments('<file>')
  .command('init', 'Init kodesmell to project. This will create .kodesmell folder for hash caching and etc...')
  .command('run [folder|file]', 'Detect bad code comments in files or folder recursively')
  .parse(process.argv);