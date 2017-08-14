const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs')
const co = require('co')
const prompt = require('co-prompt')
const { createProject } = require('./libs/upload')
const package = require('./package.json')

const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const exists = promisify(fs.exists)
const mkdir = promisify(fs.mkdir)
const rmdir = promisify(fs.rmdir)
const open = promisify(fs.open)

const { title, error } = require('./libs/constants')

const headline = chalk.green.bold('[Kodesmell] ')

const configs = require('./libs/config.js')

async function makeKodesmellDir(init) {
	if (init) {
		await mkdir(configs.KODESMELL_ROOT);
	}

	await writeFile(
		configs.KODESMELL_JSON, 
		JSON.stringify(
			{
				project: process.cwd().split(path.sep).pop(),
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
	process.exit();
}

async function init() {
	console.log(title('kodesmell init v' + package.version))

	try {
		let json = await open(configs.KODESMELL_JSON, 'r')

		// Ask re-init and 
		console.log(headline + 'Project is already inited.')
		await co(function *() {

			while (true) {
				let answer = yield prompt('Do you want to re-init Kodesmell on this project (Y/N): ')

				if (answer === 'Y') {
					makeKodesmellDir()
					break;
				}

				if (answer === 'N') {
					process.exit(0);
				}
			}


		})
	} catch(e) {
		if (e.code === 'ENOENT') {
			makeKodesmellDir(true)
		}
	}

}

init();