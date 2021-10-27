const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const {devstate } = require('../config.json');
require("dotenv").config();

module.exports={
    name: "ready",
    once: true,
    execute(client, commands){
        const CLIENT_ID = client.user.id;

        if(`${devstate}`=='true')
        {
            console.info(`Logged in as ${CLIENT_ID}!`);  
            console.info("Starting in Development Mode");
            console.info("Ready and stable!");   //Displays Ready and stable in console on run to verify the bot actually starts and does not crash
        }
        else //Fires if dev mode is set to false
        {
            console.info(`Logged in as ${CLIENT_ID}!`);
            console.info("Ready and stable!");
        }
    
    
        const rest = new REST({
            version: "9"
        }).setToken(process.env.TOKEN);
    
    
        (async () => {
            try 
            {
                if(process.env.ENV === "production")
                {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    });
                    console.log("Successfully registered commands globally.")   
                }
                else
                {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: commands
                    });
                    console.log("Successfully registered commands locally.") 
                }
            }
            catch(err)
            { 
                if(err)
                    console.error(err) 
            }
        })();
    
    }
}