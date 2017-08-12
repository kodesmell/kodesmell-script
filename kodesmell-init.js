const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs')
const co = require('co')
const prompt = require('co-prompt')
const { createProject } = require('./libs/upload')

const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const exists = promisify(fs.exists)
const mkdir = promisify(fs.mkdir)

const PROJECT_ROOT = __dirname
const KODESMELL_PROJECT_NAME = PROJECT_ROOT.split(path.sep).pop()
const KODESMELL_ROOT = path.resolve(PROJECT_ROOT, '.kodesmell')
const KODESMELL_CONFIG = path.resolve(KODESMELL_ROOT, 'kodesmell.json')
const KODESMELL_HASHKEY_CACHE = path.resolve(KODESMELL_ROOT, 'kodesmell_hashes.txt')

const headline = chalk.blue.bold('[Kodesmell] ')

async function init() {
	let email, username

	let inited = await exists(KODESMELL_ROOT)

	if (inited) {
		console.error(`This project is already inited with Kodesmell.`);
		process.exit(0);
	}

	await mkdir(KODESMELL_ROOT);

	const configs = {
		PROJECT_ROOT,
		KODESMELL_PROJECT_NAME,
		KODESMELL_ROOT,
		KODESMELL_CONFIG,
		KODESMELL_HASHKEY_CACHE,
	}
	await writeFile(KODESMELL_CONFIG, JSON.stringify(configs), {
		encoding: 'utf-8'
	});

	await writeFile(KODESMELL_HASHKEY_CACHE, '');

	await co (function *() {
		email = yield prompt('email: ');
		username = yield prompt('username: ');
	})

	await createProject({
		name: KODESMELL_PROJECT_NAME,
		username,
		email
	})

	console.log(headline + 'Inited kodesmell.')
	process.exit(0);

}

init();