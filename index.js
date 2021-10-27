require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const {Client, Intents, Collection} = require("discord.js");

const { prefix, devstate } = require('./config.json');
const {devid, brendanid, chiaraid, maincsquoteschannel, devcsquoteschannel, moddiscussion, devbotstatuschannel, mainbotstatuschannel } = require('./ids.json');
//Put developerID in ids.json in devid when working on testbots to override locked commands

const command = require('./command')
const compareServer = require('./servercheck')

const Administrative = require("./user_code/Administrative");
const Entertainment = require("./user_code/Entertainment");
const Server = require("./user_code/Server");
const Quotescode = require("./user_code/Quotescode");
const ReviewsCode = require("./user_code/Reviewscode");
const Channelcreator = require("./user_code/Channelcreator");
const Clientmessagedeletion = require("./user_code/Clientmessagedeletion");
const AutoCodeBlock = require("./user_code/AutoCodeBlock");

//THIS CONST BRENDAN LINE MUST BE COMMENTED OUT IF IN DEVELOPMENT MODE.  IT WILL WORK PROPERLY WITH JUST THIS LINE COMMENTED OUT WHEN DEVELOPING.
const Brendan = require("./user_code/Brendan");


//=======================================================================================================
//The cronjob code below runs the cronjobs task to display the quote of the day in general on main 
//server at 9 AM everyday if devstate is false (which means it is not being run in a testing enviorment)
//=======================================================================================================
if(`${devstate}`=='false')
{  
Server.cronjobs(client)
}

const intents = new Intents(32767);
const client = new Client({ intents });

//In DiscordJS V13 Intents are required!
// const client = new Client({
//     intents:
//     [
//         Intents.FLAGS.GUILDS,
//         Intents.FLAGS.GUILD_MESSAGES,
//     ]
// });

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const commands = [];

client.commands = new Collection();

for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

//=======================================================================================================
//The Client.once below runs one time when the bot first starts up... We use it to confirm that the bot 
//                                     does not crash on startup.
//=======================================================================================================
client.once('ready', () => 
{
  if(`${devstate}`=='true')
  {
    console.info(`Logged in as ${client.user.tag}!`);  
    console.info("Starting in Development Mode");
    console.info("Ready and stable!");   //Displays Ready and stable in console on run to verify the bot actually starts and doesnt crash
    client.channels.cache.get(`${devbotstatuschannel}`).send('CompSci Bot Online and Ready!'); //Shoots a ready command in #bot-status on dev server
    client.user.setActivity("with JavaScript and learning new features!"); //Sets the discord status activity of the bot to a specific string
  }
  else //Fires if dev mode is set to false
  {
    console.info(`Logged in as ${client.user.tag}!`);
    console.info("Ready and stable!");
    client.channels.cache.get(`${mainbotstatuschannel}`).send('CompSci Bot Online and Ready!'); //Shoots a ready command in #bot-status on main server

    client.user.setActivity("with code!");  //Sets the discord status activity of the bot
  }

  const CLIENT_ID = client.user.id;
  
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
});


client.on("interactionCreate", async interaction => {
  if(!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if(!command) return;

  try{
    await command.execute(interaction);
  }
  catch(err){
    if(err) console.error(err);

    await interaction.reply({content: "An error occurred while executing that command.", ephemeral:true})
  }
})


client.on("messageCreate", message => 
{ // runs whenever a message is sent

  let server = message.guild.id;

  //Ignores bots from deleting their own messages with spam filter, and deleting other bots messages
  if(!message.content.startsWith(`${prefix}quote`))
  {
    if(message.author.bot) 
      return;
  }

  //ID for CompSci server only
  //compareServer(message, '707293853958275125', RETURN => {

    //Adds a professor rating to file after mod review
    command(message, 'ratep', RETURN => {
      ReviewsCode.RateProfessor(message, client);
    })
    
    //Lists all the ratings for a specified professor that have already been approved by a mod
    command(message, 'viewratings', RETURN => {
      ReviewsCode.viewRatings(message);
    }) 

    //Prints help message
    command(message, 'help', RETURN => {
      Administrative.help(message);
    })

    //Lists quotes matching search
    command(message, 'quotelist', RETURN => {
      Quotescode.quoteList(message);
    })

    // Gives a mod the night off
    command(message, 'modsnightoff', RETURN => {
      Administrative.mno(message);  
    })

    command(message, 'lockdown', RETURN => {
      Administrative.lockChannel(message);  
    })

    //Sends a motivational quote (or meme)
    command(message, 'motivateme', RETURN => {
      Entertainment.motivateme(message);
    })

    //Responds from a random quote at Saras personal collection of quotes
    command(message, 'makemelaugh', RETURN => {
      Entertainment.makemelaugh(message);
    })

    //The famous quote command used on the CompSci server!  
    //This will allow people on EMU hangout to generate quotes ONLY... This does not include saving them
    command(message, 'quote', RETURN => {
      if(message.content.startsWith(`${prefix}quote count`))
        Quotescode.quotecounter(message);
      else
        Quotescode.quote(message);
    })

    if(message.content.toLowerCase().includes('brendy'))
    {
      message.delete({ timeout: 1000 });
      console.log("Deleting message: "+ message.content);
    }

    AutoCodeBlock.autoCodeBlock(message);

    //Adds the bypass command to toggle bypassing the Caps Filter
    if (message.content === `${prefix}bypass`) 
    {
      bypass = Server.bypass(message,bypass);
    }
  //})

  // //ID for EMU Hangout only

 //compareServer(message, '731575925262778450', RETURN => { })

//==========================================================================================================
  //Anything below this point  will work on ANY and ALL servers the bot is currently apart of
//==========================================================================================================

  command(message, 'rolelist', RETURN => { //if (message.content.startsWith(prefix + "rolelist")) {
    
    const Role = message.guild.roles.cache.find(role => role.name == "Bot");
    const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);
    
    var count;

    Members.forEach(element => 
      (message.channel.send(`${element}`),count=count+1))
      message.channel.send(`Total Number of Users in Role: ${count}`)})

    //Basic ping command to check the status and delay time of the bot
    command(message /*Message going into command function */, 
            'ping' /*Command headed into command function */,
            RETURN /*Return from command method, should NOT be used in most situations */=> {
      message.channel.send(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    })

    //Kills and stops server with response (Activated by Brendan only!)
    command(message, 'kill', RETURN => {
      Server.kill(message);
    })

    //Deletes a specified amount of messages from the channel
    command(message, 'clean', RETURN => {
      var num = message.content.slice(6).trim();
      Administrative.clean(message, num, client);
    })

    //Engages Focus Mode, an anti-procrastination tool
    command(message, 'focusmode', RETURN => {
      Entertainment.focus(message);
    })
    
    //FORCED FOCUS MODE--Gives a moderator the ability to bypass the 3 hour focusmode limit, both for themselves and other people
    command(message, 'ffm', RETURN => {
      Entertainment.forcedfocusmode(message, client);
    })

    //Displays the user info of the person who sends it
    command(message, 'user-info', RETURN => {
      message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    })

    //Attempts to kick a user
    command(message, 'kick', RETURN => {
      if (!message.guild) 
        return;
      Administrative.kick(message);
    })

    //Attempts to ban a user
    command(message, 'ban', RETURN => {
      if (!message.guild)
        return;
      Administrative.ban(message);
    })

    command(message, 'createroles', RETURN => {
      Channelcreator.rolecreator(message);
    })

  //Softkill function command call (Calls the reverse of the status of softkill)
  // if(message.content === `${prefix}softkill`) 
  // { //softkill functionality
  //   softkill = Server.soft_kill(message,softkill);
  // }

  if(`${devstate}`=='false') //If false, log chats in console AND logs in #message-feed channel, and records quotes from cs-quotes and mod discussion
  {
    Brendan.mentionalerts(client, message);
    Brendan.chatlogger(client, message);
    if((message.channel.id === `${maincsquoteschannel}`)||(message.channel.id === `${moddiscussion}`))
    {
      Quotescode.quotecatcher(message, client);
    }
  }
  else if(`${devstate}`=='true') //If devmode is true, logs chats in console ONLY and run the quote catcher on the dev quotes
  {
    console.log(`${message.content} ----> By ${message.author.username} in #${message.channel.name}`);
    if((message.channel.id === `${devcsquoteschannel}`))
    {
      Quotescode.quotecatcher(message, client);
    }
  }


  //DO NOT ENABLE THIS WITHOUT TALKING TO EMU HANGOUT SERVER OWNER AS WELL ABOUT IT
  // //The Holy CapsProtect function call
  // if (!bypass && (message.author.id !== `${brendanid}`))
  // {
  //   let capsbool = Brendan.capsProtect(message.content);
  //   if ((capsbool==false) && (!message.content.startsWith('Gave +1 Rep to')))
  //   {
  //     message.delete({ timeout: 2000 })
  //     console.log("Deleting message: "+message.content);
  //   }
  // }

/////////////////////////////CHANNEL CREATION BLOCK (DO NOT REMOVE!  COMMENTED OUT FOR SECURITY REASONS!)/////////////////////////////

//    if(message.content.startsWith(`${prefix}csvparse`)&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`))){
//      var promise = new Promise(function(res,rej)
//      { 
//        res(Channelcreator.categorycreator(message))
//       }).finally(()=>{ 
//        Channelcreator.csvparse(message);
//      }).catch(console.error)
//      }
//     if((message.content.startsWith(`${prefix}cc`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`)))
//    {
//     var name= message.content.substring(4,message.content.length)
//     if(name=="")
//       name="new-unnamed-channel"
//     Channelcreator.createchannel(name,message)
//    }
//    if((message.content.startsWith(`${prefix}catc`))&&(((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`))))
//      Channelcreator.categorycreator(message)
//    if((message.content.startsWith(`${prefix}deleteALL`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${chiaraid}`)))
//     Channelcreator.deletechannel(message);
//    if((message.content.startsWith(`${prefix}deletecat`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`)))
//      Channelcreator.deletecategory(message);
     
  /////////////////////////////CHANNEL CREATION BLOCK (DO NOT REMOVE!  COMMENTED OUT FOR SECURITY REASONS!)/////////////////////////////

}); //End of message sent loop

client.login(process.env.TOKEN);