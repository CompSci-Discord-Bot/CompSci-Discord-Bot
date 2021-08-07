const Discord = require('discord.js')// imports the discord js library
const client = new Discord.Client();

//Imports the necessary user code files to the index in order for later use
const { prefix, token, devstate } = require('./config.json');
const {devid, brendanid, chiaraid, maincsquoteschannel, devcsquoteschannel, moddiscussion, devbotstatuschannel, mainbotstatuschannel } = require('./ids.json');
//Put developerID in ids.json in devid when working on testbots to override locked commands

const command = require('./command')
const Administrative = require("./user_code/Administrative");
const Entertainment = require("./user_code/Entertainment");
const Server = require("./user_code/Server");
const Quotescode = require("./user_code/Quotescode");
const ReviewsCode = require("./user_code/Reviewscode");
const Channelcreator = require("./user_code/Channelcreator");
const Clientmessagedeletion = require("./user_code/Clientmessagedeletion");
const AutoCodeBlock = require("./user_code/AutoCodeBlock");

var softkill = false;
var bypass = false;

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

    client.user.setActivity("with JavaScript and learning new features!");  //Sets the discord status activity of the bot
  }
});

//Completes a cronjob task to display the quote of the day in general on main server at 9 AM everyday if devstate is false
if(`${devstate}`=='false')
{
  Server.cronjobs(client)
}

client.on("message", message => 
{ // runs whenever a message is sent

  //Ignores bots from deleting their own messages with spam filter, and deleting other bots messages
  if(!message.content.startsWith(`${prefix}quote`))
  {
    if(message.author.bot) 
      return;
  }

  if (!softkill)
  {
    //Basic ping command to check the status and delay time of the bot
    command(message /*Message going into command function */, 
            'ping' /*Command headed into command function */,
            RETURN /*Return from command method, should NOT be used in most situations */=> {
      message.channel.send(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    })

    //Kills and stops server with response
    command(message, 'kill', RETURN => {
      Server.kill(message);
    })

    //Adds a professor rating to file after mod review
    command(message, 'ratep', RETURN => {
      ReviewsCode.RateProfessor(message, client);
    })

    //Engages Focus Mode, an anti-procrastination tool
    command(message, 'focusmode', RETURN => {
      Entertainment.focus(message);
    })

    //Lists all the ratings for a specified professor that have already been approved by a mod
    command(message, 'viewratings', RETURN => {
      ReviewsCode.viewRatings(message);
    })

    //Deletes a specified amount of messages from the channel
    command(message, 'clean', RETURN => {
      var num = message.content.slice(6).trim();
      Administrative.clean(message, num, client);
    })

    //Prints help message
    command(message, 'help', RETURN => {
      Administrative.help(message);
    })

    //FORCED FOCUS MODE--Gives a moderator the ability to bypass the 3 hour focusmode limit, both for themselves and other people
    command(message, 'ffm', RETURN => {
      Entertainment.forcedfocusmode(message, client);
    })

    //The famous quote command!
    command(message, 'quote', RETURN => {
      if(message.content.startsWith(`${prefix}quote count`))
        Quotescode.quotecounter(message);
      else
        Quotescode.quote(message);
    })

    //Lists quotes matching search
    command(message, 'quotelist', RETURN => {
        Quotescode.quoteList(message);
    })

    //Responds from a random quote at Saras personal collection of quotes
    command(message, 'makemelaugh', RETURN => {
      Entertainment.makemelaugh(message);
    })

    //Displays the user info of the person who sends it
    command(message, 'user-info', RETURN => {
      message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    })

    //Send Custom emojis message when doing {prefix}ce comamnd
    command(message, 'ce', RETURN => {
      Entertainment.ce(message);  
    })

    //Sends a motivational quote (or meme)
    command(message, 'motivateme', RETURN => {
      Entertainment.motivateme(message);
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

    // Gives a mod the night off
    command(message, 'modsnightoff', RETURN => {
      Administrative.mno(message);  
    })

    command(message, 'lockdown', RETURN => {
      Administrative.lockChannel(message);  
    })

    AutoCodeBlock.autoCodeBlock(message);
    //Message Filter for words roomer, gocci, and Brendy
    if(message.content.includes('roomer') || message.content.includes('Roomer')|| message.content.includes('gocci')|| message.content.includes('Gocci')|| message.content.includes('brendy') || message.content.includes('Brendy'))
    {
      message.delete({ timeout: 1000 });
      console.log("Deleting message: "+ message.content);
    }

    //Adds the bypass command to toggle bypassing the Caps Filter
    if (message.content === `${prefix}bypass`) 
    {
      bypass = Server.bypass(message,bypass);
    } 
  }

  //Softkill function command call (Calls the reverse of the status of softkill)
  if(message.content === `${prefix}softkill`) 
  { //softkill functionality
    softkill = Server.soft_kill(message,softkill);
  }

  if(`${devstate}`=='false') //If false, log chats in console AND logs in #message-feed channel, and records quotes from cs-quotes and mod discussion
  {
    Administrative.mentionalerts(client, message);
    Server.chatlogger(client, message);
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

  //The Holy CapsProtect function call
  if (!bypass && (message.author.id !== `${brendanid}`))
  {
    let capsbool = Server.capsProtect(message.content);
    if ((capsbool==false) && (!message.content.startsWith('Gave +1 Rep to')))
    {
      message.delete({ timeout: 2000 })
      console.log("Deleting message: "+message.content);
    }
  }

/////////////////////////////CHANNEL CREATION BLOCK (DO NOT REMOVE!  COMMENTED OUT FOR SECURITY REASONS!)/////////////////////////////

   if(message.content.startsWith(`${prefix}csvparse`)&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`))){
     var promise = new Promise(function(res,rej){ 
       
       res(Channelcreator.categorycreator(message))
      }).finally((table)=>{ 
       Channelcreator.csvparse(message,table);
     }).catch(console.error)
    }
    if((message.content.startsWith(`${prefix}cc`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`)))
   {
    var name= message.content.substring(4,message.content.length)
    if(name=="")
      name="new-unnamed-channel"
    Channelcreator.createchannel(name,message)
   }
   if((message.content.startsWith(`${prefix}catc`))&&(((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`))))
     Channelcreator.categorycreator(message)
   if((message.content.startsWith(`${prefix}deleteALL`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${chiaraid}`)))
    Channelcreator.deletechannel(message);
   if((message.content.startsWith(`${prefix}deletecat`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`)))
     Channelcreator.deletecategory(message);
   if((message.content.startsWith(`${prefix}swapper`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`)))
     Channelcreator.swapper(message);
   if((message.content.startsWith(`${prefix}channelsort`))&&((message.author.id === `${brendanid}`)||(message.author.id === `${devid}`)))
     Channelcreator.channelsort(message);

  /////////////////////////////CHANNEL CREATION BLOCK (DO NOT REMOVE!  COMMENTED OUT FOR SECURITY REASONS!)/////////////////////////////

}); //End of message sent loop


//Fires when a message is deleted
client.on('messageDelete', async message => 
{  
  Clientmessagedeletion.main(message);
});


//Fires when users updates their user status presence and logs that status in a specific text channel
client.on('presenceUpdate', (oldPresence, newPresence) => 
{
  Administrative.presenceUpdate(oldPresence, newPresence);
});


client.login(token)
