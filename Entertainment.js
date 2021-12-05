//Entertainment.js
const { focusmoderole }= require('../ids.json');
const fs = require('fs');
let jsonData = "";


//Script for reading JSON file
fs.readFile('./logs/quotes.json', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        console.log("Unable to read quotes json file");
    } else {
        jsonData = JSON.parse(data);
    }
})


//Function that reacts with all unique server emojis 
async function ce(message) 
{
    const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'billtiger');
    const reactionEmoji2 = message.guild.emojis.cache.find(emoji => emoji.name === 'hackerevett');
    const reactionEmoji3 = message.guild.emojis.cache.find(emoji => emoji.name === '420');
    const reactionEmoji4 = message.guild.emojis.cache.find(emoji => emoji.name === '69');
    const reactionEmoji5 = message.guild.emojis.cache.find(emoji => emoji.name === 'potatojump');
    const reactionEmoji6 = message.guild.emojis.cache.find(emoji => emoji.name === 'billiam');
    const reactionEmoji7 = message.guild.emojis.cache.find(emoji => emoji.name === 'youngmanny');
    const reactionEmoji8 = message.guild.emojis.cache.find(emoji => emoji.name === 'CourtManny');
    const reactionEmoji9 = message.guild.emojis.cache.find(emoji => emoji.name === 'sillybilly');
    const reactionEmoji10 = message.guild.emojis.cache.find(emoji => emoji.name === 'santamanny');
    const reactionEmoji11 = message.guild.emojis.cache.find(emoji => emoji.name === 'billywow');
    const reactionEmoji12 = message.guild.emojis.cache.find(emoji => emoji.name === 'zhangy');
    const reactionEmoji13 = message.guild.emojis.cache.find(emoji => emoji.name === 'billy2');
    const reactionEmoji14 = message.guild.emojis.cache.find(emoji => emoji.name === 'manny');
    const reactionEmoji15 = message.guild.emojis.cache.find(emoji => emoji.name === 'billmoji');
    const reactionEmoji16 = message.guild.emojis.cache.find(emoji => emoji.name === 'tim');
  
    message.react(reactionEmoji);
    message.react(reactionEmoji2);
    message.react(reactionEmoji3);
    message.react(reactionEmoji4);
    message.react(reactionEmoji5);
    message.react(reactionEmoji6);
    message.react(reactionEmoji7);
    message.react(reactionEmoji8);
    message.react(reactionEmoji9);
    message.react(reactionEmoji10);
    message.react(reactionEmoji11);
    message.react(reactionEmoji12);
    message.react(reactionEmoji13);
    message.react(reactionEmoji14);
    message.react(reactionEmoji15);
    message.react(reactionEmoji16);
}
  
//Function that sends a motivation quote or meme
async function motivateme(message) 
{
    var quotes = jsonData.motivationalQuotes;
    
    var index = getRandomInt(quotes.length - 1);
    message.channel.send(quotes[index]);
}

//Function that makes people laugh
async function makemelaugh(message) 
{
    var quotes = jsonData.makeMeLaugh;
    
    var index = getRandomInt(quotes.length - 1);
    message.channel.send(quotes[index]);
}

function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

//Code to engage Focus Mode for individual use
async function focus(message) 
{
    var parameter = message.content.slice(10).trim();
    var timeString = parameter.substr(0,parameter.indexOf(' '));
    var time = parseInt(timeString);
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    var timeStatement;
    var jstime;

    if (message.content.includes("second") || message.content.includes("seconds")) 
    { //Cancer conditional
        if (time > 10800) 
        {
            message.channel.send('Cannot engage Focus Mode for more than 3 hours');
            return;
        }
        jstime = time * second;
        if (time == 1)
            timeStatement = time + " second";
        else timeStatement = time + " seconds";
    }
    else if (message.content.includes("minute") || message.content.includes("minutes")) 
    {
        if (time > 180) 
        {
            message.channel.send('Cannot engage Focus Mode for more than 3 hours');
            return;
        }
        jstime = time * minute;
        if (time == 1)
            timeStatement = time + " minute";
        else timeStatement = time + " minutes";
    }
    else if (message.content.includes("hour") || message.content.includes("hours")) 
    {
        if (time > 3) 
        {
            message.channel.send('Cannot engage Focus Mode for more than 3 hours');
            return;
        }
        jstime = time * hour;
        if (time == 1)
            timeStatement = time + " hour";
        else timeStatement = time + " hours";
    }
    else jstime = time * 0;

    let role = message.guild.roles.cache.find(role => role.name === `${focusmoderole}`);
    message.member.roles.add(role).catch(console.error);
    console.log(`[FOCUSMODE] ${message.author.username} Entered Focus Mode for ${timeStatement}`);
    message.channel.send('Focus Mode has been engaged for ' + timeStatement + ' for ' + message.author.username);
    
    setTimeout(() => {
        message.member.roles.remove(role).catch(console.error);
        message.channel.send('Focus mode has been disabled for ' + message.author.username);
    }, jstime);
}



//Code for an Administrator to put someone in forced focus mode
function forcedfocusmode(message) 
{
    if (message.member.hasPermission('ADMINISTRATOR')) 
    {
        var parameter = message.content.slice(4).trim();
        var timeString = parameter//.substr(0,parameter.indexOf(' '));
        var time = parseInt(timeString);
        
        const second = 1000;
        const minute = 60 * second;
        const hour = 60 * minute;
        var timeStatement;
        var jstime;

        if (message.content.includes("second") || message.content.includes("seconds")) 
        { //Cancer conditional
            if (time > 86400) 
            {
                message.channel.send('Cannot engage Focus Mode for more than 3 hours');
                return;
            }
            jstime = time * second;
            if (time == 1)
                timeStatement = time + " second";
            else timeStatement = time + " seconds";
        }
        else if (message.content.includes("minute") || message.content.includes("minutes")) 
        {
            if (time > 1440) 
            {
                message.channel.send('Cannot engage Focus Mode for more than 3 hours');
                return;
            }
            jstime = time * minute;
            if (time == 1)
                timeStatement = time + " minute";
            else timeStatement = time + " minutes";
        }
        else if (message.content.includes("hour") || message.content.includes("hours")) 
        {
            if (time > 24) 
            {
                message.channel.send('Cannot engage Focus Mode for more than 3 hours');
                return;
            }
            jstime = time * hour;
            if (time == 1)
                timeStatement = time + " hour";
            else timeStatement = time + " hours";
        }
        else jstime = time * 0;

        let role = message.guild.roles.cache.find(role => role.name === `${focusmoderole}`);
        const user = message.mentions.users.first();
        const member = message.guild.member(user);
        memberout = member.user.username;
        member.roles.add(role).catch(console.error);

        console.log(`[FORCED-FOCUSMODE] ${memberout} was put into focusmode for ${timeStatement}`);
        message.channel.send(`Focus Mode has been engaged for ${timeStatement} for ${memberout}`);
        
        setTimeout(() => {
            member.roles.remove(role).catch(console.error);
            message.channel.send(`Focus mode disabled for ${memberout}`);
        }, jstime);  
    }
    else
    {
        message.channel.send(`You do not have permission to use forced focusmode`);
    }    
}


function embed(Discord, title, author, colorcode, page, field1)
{
    const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(`#${colorcode}`)
    .addFields({
        name: `${page}`,
        value: `${field1}`,
        inline: true
    })
    return embed;
}

module.exports = {motivateme, ce, makemelaugh, focus, forcedfocusmode, embed};
