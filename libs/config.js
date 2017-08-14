const path = require('path')

const PROJECT_ROOT = process.cwd();
const PROJECT_NAME = PROJECT_ROOT.split(path.sep).pop();
const KODESMELL_ROOT = path.resolve(PROJECT_ROOT, '.kodesmell');
const KODESMELL_JSON = path.resolve(KODESMELL_ROOT, 'kodesmell.json');
const KODESMELL_DB = path.resolve(KODESMELL_ROOT, 'kodemsmell_db.json');

module.exports = {
    PROJECT_ROOT,
    PROJECT_NAME,
    KODESMELL_ROOT,
    KODESMELL_JSON,
    KODESMELL_DB
}
