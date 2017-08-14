# kodesmell-script
A command-line tool for creating Bad code detection

# Prerequisite
1. Node.js installed (version 7 >= 0)

# How to install
1. Git clone this repository
2. `cd kodesmell-script`
3. `npm run build`

**If you encounter errors on `npm run build`, try `npm run remove` first then run `npm run build`**

# How to uninstall
1. `npm run remove`

**If you encounter and problems installing Kodesmell. Issue it in https://github.com/kodesmell/kodesmell-script/issues.**

# How to Use
1. Run `kodesmell init` in your project folder.
  - This will init **.kodesmell** folder in this folder.
  - Do not add **.kodesmell** folder to **.gitignore**, since this folder will hold basic configs (no credentials)

2. Add kodesmell comment to any code that stinks.
  - kodesmell comment should look like this 
  - `// ;) Should handle error cases`, `// ;) Put this code to configs` (#904c3e9)
  - `;)` is the symbol **Kodesmell** uses to detect your sadness.

3. Run `kodesmell run [folder | file]`
  - e.g) `kodesmell run` (runs at YOUR_PROJECT_FOLDER)
  - e.g) `kodesmell run src` (runs at YOUR_PROJECT_FOLDER/src)
  - **IMPORTANT** Do not run on production code. Production codes usually contains `;)` as result of minifying. Later we will change **Kodemell symbol**. But still then, please do not run this on production code.

4. **Kodesmell** will assign auto-generated hash to each **kodemsell comments**

5. Result will be pushed to your **Kodesmell Database** and you can view it in Android App.

