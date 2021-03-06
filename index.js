const Discord = require("discord.js"); // imports the discord library
const { prefix, token, devstate } = require('./config.json');
const { csquoteschannel, brendanid, moddiscussion }= require('./ids.json');
const client = new Discord.Client(); // creates a discord client

//Imports the necessary user code files to the index in order for later use
const Administrative = require("./user_code/Administrative");
const Entertainment = require("./user_code/Entertainment");
const Server = require("./user_code/Server");
const Quotescode = require("./user_code/Quotescode");
const ReviewsCode = require("./user_code/Reviewscode");
const Channelcreator = require("./user_code/Channelcreator");
const Clientmessagedeletion = require("./user_code/Clientmessagedeletion");

var softkill = false; 
var bypass = false;

client.once("ready", () => 
{
  if(`${devstate}`=='true')
  {
    console.info(`Logged in as ${client.user.tag}!`);
    //Displays Ready and stable in console on run to verify the bot actually starts and doesnt crash
    console.info("Starting in Development Mode");
    //Shoots a Ready command into console
    console.info("Ready and stable!");
    //client.channels.cache.get('816882589116923914').send('Dev Mode READY!'); 

    //client.user.setActivity("with JavaScript and learning new features!"); //Sets the discord status activity of the bot
  }
  else
  {
    console.info(`Logged in as ${client.user.tag}!`);
    console.info("Ready and stable!");
    client.channels.cache.get('806391647294324766').send('CompSci Bot Online and Ready!'); 
    //Shoots a ready command in #bot-status

    client.user.setActivity("with JavaScript and learning new features!");  //Sets the discord status activity of the bot
  }
});

if(`${devstate}`=='false')
{
  //Completes a cronjob task to display the quote of the day in general on main server at 10 AM everyday if devstate is false
  Server.cronjobs(client)
}

client.on("message", message => 
{ // runs whenever a message is sent

      //------------------------------------Message Filtering and Flagging Begins Here-------------------------
  //Ignores bots from deleting their own messages with spam filter, and deleting other bots messages
  if(!message.content.startsWith(`${prefix}quote`))
  {
    if (message.author.bot) 
      return;
  }

  if (!bypass)
    {
      let capsbool = Server.capsProtect(message.content);
      if ((capsbool==false) && (!message.content.startsWith('Gave +1 Rep to')))
      {
        message.delete({ timeout: 2000 })
        console.log("Deleting message: "+message.content);
      } 
    }

    if(message.content.includes('Brendan') || message.content.includes('Klein')|| message.content.includes('brendan')|| message.content.includes('klein'))
    {
      if(`${devstate}`=='false')  //ID of Brendan Mention channel on main server
        client.channels.cache.get('818584141846151219').send(`${message.author.username} mentioned you in a message! --> ${message.content}`); 
    }
    if(message.content.includes('roomer') || message.content.includes('Roomer')|| message.content.includes('gocci')|| message.content.includes('Gocci'))
    {
      message.delete({ timeout: 1000 });
      console.log("Deleting message: "+ message.content);
    }

    //Skips executing chat logger in text channel if devmode in config.json is true, otherwise logs chats in console ONLY
    if(`${devstate}`=='false')
      Server.chatlogger(client, message);
    if(`${devstate}`=='true')
      console.log(`${message.content} ----> By ${message.author.username} in #${message.channel.name}`);
    //------------------------------------Message Filtering and Flagging Ends Here-------------------------


  if (!softkill)
  {
    //Adds the bypass command to toggle bypassing the Caps Filter
    if (message.content === `${prefix}bypass`) 
    {
      bypass = Server.bypass(message,bypass);
    } 

    //Responds with a random quote from the list compiled on 2.7.2021 from cs-quotes channel
    if (message.content.startsWith(`${prefix}quote`)) 
    {
      Quotescode.quote(message);
    } 

    //Responds from a random quote at Saras personal collection of quotes
    if (message.content === `${prefix}makemelaugh`) 
    {
      Entertainment.makemelaugh(message);
    } 

    //Responds with Pong after send the ping command with prefix
    else if (message.content === `${prefix}ping`) 
    {  
      message.channel.send(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    } 

    //Kills and stops server with response when a specific user (In this case Brendan#9412) runs the kill command with prefix
    else if (message.content === `${prefix}kill`)  
    {
        Server.kill(message);
    }

    //Displays the user info of the person who sends
    else if (message.content === `${prefix}user-info`)
    {
      message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }

    //Send Custom emojis message when doing {prefix}ce comamnd
    else if (message.content === `${prefix}ce`)
    {
      Entertainment.ce(message);  
    }

    //Sends a motivational quote (or meme)
    else if (message.content === `${prefix}motivateme`)
    {
      Entertainment.motivateme(message);
    }

    //Attempts to kick user
    else if (message.content.startsWith(`${prefix}kick`)) 
    {
      if (!message.guild) return;

      Administrative.kick(message);
    }

    //Attempts to ban user
    else if (message.content.startsWith(`${prefix}ban`)) 
    {
      if (!message.guild) return;

      Administrative.ban(message);
    }

    //Prints help message
    else if (message.content.startsWith(`${prefix}help`)) 
    {
      Administrative.help(message);
    }

    //Cleans a specified amount of messages
    if (message.content.startsWith(`${prefix}clean`))
    {
      var num = message.content.slice(6).trim();
      Administrative.clean(message, num, client);
    }

    //Adds a professor rating
    if(message.content.startsWith(`${prefix}ratep`))
    {
      ReviewsCode.RateProfessor(message, client);
    }

    //Lists all the ratings for a specified professor
    if(message.content.startsWith(`${prefix}viewratings`))
    {
      ReviewsCode.viewRatings(message);
    }

    //Engages Focus Mode, an anti-procrastination tool
    if (message.content.startsWith(`${prefix}focusmode`))
    {
      Entertainment.focus(message);
    }
  }
  if(message.content === `${prefix}softkill`) 
  { //softkill functionality
    softkill = Server.soft_kill(message,softkill);
  }

  if((message.channel.id === `${csquoteschannel}`)||(message.channel.id === `${moddiscussion}`))
  {
    Quotescode.quotecatcher(message, client);
  }

  if((message.content.startsWith(`${prefix}canned`))&&((message.author.id = `${brendanid}`)))
  {
    //message.channel.send(`All the mods are currently unavalible, if you need something urgently please email the instructor at LZhang5@emich.edu.  Have a nice day.`);
    //message.channel.send(`"This so dumb - L. Zhang"`);
    message.channel.send(`"Enough is enough... SHUT UP" - Zhang`)
  }

  if((message.content.startsWith(`${prefix}csvparse`))&&((message.author.id = `${brendanid}`)))
    Channelcreator.csvparse(message)
  //if((message.content.startsWith(`${prefix}cc`))&&((message.author.id = `${brendanid}`)))
  //  Channelcreator.createchannel(message)
  if((message.content.startsWith(`${prefix}catc`))&&((message.author.id = `${brendanid}`)))
    Channelcreator.categorycreator(message)
  if((message.content.startsWith(`${prefix}deleteALL`))&&(message.author.id === `${brendanid}`))
    Channelcreator.deletechannel(message);
  if((message.content.startsWith(`${prefix}deletecat`))&&(message.author.id === `${brendanid}`))
    Channelcreator.deletecategory(message);
  if(message.content.startsWith(`${prefix}status`))
  {
    if(message.content === `${prefix}status help`)
    {
 
      return;
    }
    if (message.member.hasPermission('ADMINISTRATOR')) 
    {
      const content = message.content.replace(`${prefix}status `, '')
      // "!status hello world" -> "hello world"

      if(content.startsWith(`online`))
      {
        status='online';
        var helper = content.replace(`online `, '')
      }
      if(content.startsWith(`idle`))
      {
        status='idle';
        var helper = content.replace(`idle `, '')
      }
      if(content.startsWith(`dnd`))
      {
        status='dnd';
        var helper = content.replace(`dnd `, '')
      }
      if(content.startsWith(`offline`))
      {
        status='offline';
        var helper = content.replace(`offline `, '')
      }

      client.user.setPresence({ activity: { name: `${helper}`, type: "WATCHING" }, status: `${status}` })
      .then(console.log)
    }
  }
}); //End of Message Sent loop

client.on('messageDelete', async message => {
    Clientmessagedeletion.main(message);
});



client.login(token); // starts the bot up