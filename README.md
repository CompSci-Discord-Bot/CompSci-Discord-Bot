# CompSci-Discord-Bot
This is a place where we can collaborate and submit code and things to add for the new Computer Science Discord Bot :D
Currently used at Eastern Michigan University for an unofficial Computer Science Discord managed by undergraduate students.

In order to setup the bot to test on a local server...
1. Head over to https://discord.com/developers/applications and create an application.  Then create a bot inside of the application you just created.
2. Copy the bot token, and the application client ID.
3. Head over to https://discordapi.com/permissions.html#8
  --Click the Administrator Checkbox
  --Paste your CLIENT ID into the box near the bottom left labeled Client ID.
  --Give the URL that the program generates to Brendan to add to the Bot Development Server (with everyone else), or create your own discord server for debugging and testing.
4. Join the official Dev server for development at https://discord.gg/AMdw4YapgW
5. Install node.js on your local computer.  Download link can be found here --> https://nodejs.org/en/download/
6. Install a js, json, and txt editor.  Personally most of our development team uses Visual Studio Code.  Download link can be found at https://code.visualstudio.com/download
7. OPTIONAL After installing these packages... It is highly recommended that you restart your computer.  This step is not required but is highly recommended!
8. Create a config.json file and save it in the root directory.  (index.js is the main bot code file, so save your newly created config.json in the same folder).  An example of what your config file should look like is located below.
9. In order to not get an error when you try to run the index.js file, you will need to fix dependancy errors.  In order to do this, run the command "npm install" in the root directory (the same folder that index.js is located).
10. After you do this and let the corresponding files automatically install, do "node index.js" or "npm run devStart" to run the bot code.
11. If you have any other questions please reach out to Brendan directly, or post an issue on the Github!  Thanks :D

CONFIG.JSON SETUP:
```javascript
  {
	"prefix": "*",
	"token": "BOTTOKEN",
	"devstate":true
  }
```

Be sure to replace BOTTOKEN with the value of your bots token which you saved from step 2.
*Please be sure that your prefix is unique to your bot only.  This way when we have multiple people testing with their bots at once they dont collide and infinitely respond to eachother.*
