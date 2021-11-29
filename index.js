//=======================================================================================================
//Imports the necessary user code files to the index in order for later use
//=======================================================================================================
const Discord = require('discord.js')// imports the discord js library
const client = new Discord.Client();
const { prefix, token, devstate } = require('./config.json');
const {devid, brendanid, chiaraid, maincsquoteschannel, devcsquoteschannel, moddiscussion, devbotstatuschannel, mainbotstatuschannel } = require('./ids.json');
//Put developerID in ids.json in devid when working on channelcreator to override locked commands

//Include Command and Server handler code
const command = require('./user_code/command')
const compareServer = require('./user_code/servercheck')

//Include rest of exported commands
const Administrative = require("./user_code/Administrative");
const Entertainment = require("./user_code/Entertainment");
const Server = require("./user_code/Server");
const Quotescode = require("./user_code/Quotescode");
const ReviewsCode = require("./user_code/Reviewscode");
const Channelcreator = require("./user_code/Channelcreator");
const Clientmessagedeletion = require("./user_code/Clientmessagedeletion");
const AutoCodeBlock = require("./user_code/AutoCodeBlock");
const NewChannel = require("./user_code/NewChannel");


//THIS CONST BRENDAN LINE MUST BE COMMENTED OUT IF IN DEVELOPMENT MODE.  IT WILL WORK PROPERLY WITH JUST THIS LINE COMMENTED OUT WHEN DEVELOPING.
const Brendan = require("./user_code/Brendan");

// var softkill = false;
// var bypass = false;

/* =======================================================================================================
The Client.once belowRuns one time when the bot first starts up... We use it to confirm that the bot 
                                     does not crash on startup.
=======================================================================================================*/
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
});


/*=======================================================================================================
  The cronjob code below Completes a cronjob task to display the quote of the day in general on main 
  server at 9 AM everyday if devstate is false (which means it is not being run in a testing enviorment)
//=======================================================================================================*/
if(`${devstate}`=='false')
{  
  Server.cronjobs(client)
}

/*=======================================================================================================
   The client.on section below activates when anybody on the server sends a message on any server the bot
   is apart of.  This may include the EMU CompSci server, the EMU hangout, Bot Dev, or any other server 
   depending on the situation.
//=======================================================================================================*/
client.on("message", message => 
{
  //Ignores bots from deleting their own messages with spam filter, and deleting other bots messages
  if(!message.content.startsWith(`${prefix}quote`))
  {
    if(message.author.bot) 
      return;
  }

  //ID for CompSci server only
  compareServer(message, '707293853958275125', RETURN => {

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
    //This will allow people on EMU CompSci to generate quotes ONLY... This does not include saving them
    command(message, 'quote', RETURN => {
      if(message.content.startsWith(`${prefix}quote count`))
        Quotescode.quotecounter(message);
      else
        Quotescode.quote(message);
    })

    AutoCodeBlock.autoCodeBlock(message);

    // //Adds the bypass command to toggle bypassing the Caps Filter
    // if (message.content === `${prefix}bypass`) 
    // {
    //   bypass = Server.bypass(message,bypass);
    // }
  })

/*==========================================================================================================
      Anything below this point  will work on ANY and ALL servers the bot is currently apart of
 ==========================================================================================================*/
  Brendan.filter(message);

  command(message, 'rolelist', RETURN => { 
    const Role = message.guild.roles.cache.find(role => role.name == "Bot");
    const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);

    Members.forEach(element => message.channel.send(`${element}`))
    })

    //Basic ping command to check the status and delay time of the bot
    command(message, /*Message going into command function */
            'ping', /*Command headed into command function */
            RETURN /*Return from command method, should NOT be used in most situations */=> {
      message.channel.send(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    })

    //Halts bot with response (Activated by Brendan only!)
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
    Brendan.mentions(client, message);
    Brendan.chatlogger(client, message);
    
    if((message.channel.id === `${maincsquoteschannel}`)||(message.channel.id === `${moddiscussion}`))
      Quotescode.quotecatcher(message, client);
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

  //  if(message.content.startsWith(`${prefix}csvparse`)&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`))){
  //    var promise = new Promise(function(res,rej)
  //    { 
  //      res(Channelcreator.categorycreator(message))
  //     }).finally(()=>{ 
  //      Channelcreator.csvparse(message);
  //    }).catch(console.error)
  //    }
  //   if((message.content.startsWith(`${prefix}cc`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`)))
  //  {
  //   var name= message.content.substring(4,message.content.length)
  //   if(name=="")
  //     name="new-unnamed-channel"
  //   Channelcreator.createchannel(name,message)
  //  }
  //  if((message.content.startsWith(`${prefix}catc`))&&(((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`))))
  //    Channelcreator.categorycreator(message)
  //  if((message.content.startsWith(`${prefix}deleteALL`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${chiaraid}`)))
  //   Channelcreator.deletechannel(message);
  //  if((message.content.startsWith(`${prefix}deletecat`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`)))
  //    Channelcreator.deletecategory(message);
     
  /////////////////////////////CHANNEL CREATION BLOCK (DO NOT REMOVE!  COMMENTED OUT FOR SECURITY REASONS!)/////////////////////////////



//Private module used for Brendan's private quotes pointed to Alerts
  compareServer(message, '858812074813423696', RETURN => { 
    if(`${devstate}`=='false')
      Brendan.PrivateQuotes(message, client);
  });

}); //End of message sent loop


if(`${devstate}`=='false') 
{
  //Fires when a message is deleted
  client.on('messageDelete', async message => {  
    Clientmessagedeletion.main(message);
  });

  //Fires when users updates their user status presence and logs that status in a specific text channel
  client.on('presenceUpdate', async (oldPresence, newPresence) => {
    Brendan.presence(oldPresence, newPresence);
  });

  //Fires when a new text channel is created on any server
  client.on('channelCreate', async (channel) => {
    NewChannel.AutoTicketMessage(channel);
  });

  //Fires when the status of voice activity changes (I.E. When someone joins a vc, leaves a vc, or switches vc)
  client.on('voiceStateUpdate', (oldState, newState) => {
    Brendan.voiceupdates(newState, oldState, client);
  });
}

//Logs the bot into the token value given on the 
client.login(token)