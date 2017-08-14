# kodesmell-script
A command-line tool for creating Bad code detection

# Prerequisite
1. Node.js installed (version 7 >= 0)

# How to install
1. Run `npm install -g kodesmell-script` or `yarn install -g kodesmell-script` (if you are using yarn https://yarnpkg.com/lang/en/)

**If you encounter and problems installing Kodesmell. Issue it in https://github.com/kodesmell/kodesmell-script/issues.

# How to Use
1. Run `kodesmell init` in your project folder.
  - This will init *.kodesmell* folder in this folder.
  - Do not add *.kodesmell* folder to *.gitignore*, since this folder will hold basic configs (no credentials)

2. Add kodesmell comment to any code that stinks.
  - kodesmell comment should look like this 
  - `// ;) Should handle error cases`, `// ;) Put this code to configs` (#fd64eb0)
  - `;)` is the symbol *Kodesmell* uses to detect your sadness.

3. Run `kodesmell run [folder | file]`
  - e.g) `kodesmell run .` (runs at YOUR_PROJECT_FOLDER)
  - e.g) `kodesmell run src` (runs at YOUR_PROJECT_FOLDER/src)

4. *Kodesmell* will assign auto-generated hash to each *kodemsell comments*

5. Result will be pushed to your *Kodesmell Database* and you can view it in Android App.

