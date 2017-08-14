const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs')
const co = require('co')
const prompt = require('co-prompt')
const { createProject } = require('./lib/upload')
const package = require('./package.json')

const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const exists = promisify(fs.exists)
const mkdir = promisify(fs.mkdir)
const rmdir = promisify(fs.rmdir)
const open = promisify(fs.open)

const { title, error } = require('./lib/constants')

const headline = chalk.hex('#08f').bold('Kodesmell ')
const text = chalk.gray

const configs = require('./lib/config.js')

async function makeKodesmellDir({ id, name }) {	
	await mkdir(configs.KODESMELL_ROOT);
	await writeFile(
		configs.KODESMELL_JSON, 
		JSON.stringify(
			{
				project: id,
				name,
				_v: package.version
			}
		),
		{
			flag: "w",
			encoding: 'utf-8'
		}
	);

	console.log(headline + 'Suceessfully inited.')
	console.log(headline + 'Start with \'kodesmell run\' in this repo')
}

async function init() {
	const name = process.cwd().split(path.sep).pop()

	try {
		let { data } = await createProject({ name })
		await makeKodesmellDir(data)
		process.exit();
	} catch(e) {
		console.error(e);
		process.exit(0);
	}
}

(async function main() {
	console.log(title('kodesmell init v' + package.version))

	try {
		let json = await open(configs.KODESMELL_JSON, 'r')
		console.log('Project is already inited.')
		process.exit();
	} catch(e) {
		if (e.code === 'ENOENT') {
			init()
		}
	}

})()