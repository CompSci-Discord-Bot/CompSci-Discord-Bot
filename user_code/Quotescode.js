//Quotescode.js
var SelfReloadJSON = require('self-reload-json');
const { MessageAttachment } = require('discord.js');
const { modrole, contentapprovalchannel }= require('../ids.json');
const fs = require('fs');
let jsonData = "";
const { prefix } = require('../config.json');


jsonData = new SelfReloadJSON('./logs/quotes.json');

//Function for Teacher quotes command!  DO NOT REMOVE
async function quote(message) 
{
    var quotes2 = jsonData.teacherQuotes;
    var filteredQuotes = []
    console.log(message.content);

    if(message.content.length > 6) //Runs if seaching for a specific keyword ONLY
    {
        var search = message.content.replace("!quote ", "");

        quotes2.forEach(function(quote) 
        {
            if (quote.toLowerCase().includes(search.toLowerCase() )) 
            {
                filteredQuotes.push(quote);
            }
        });
    } 
    else 
    {
        filteredQuotes = quotes2;
    }
    if (filteredQuotes.length > 0) 
    {
        var index = getRandomInt(filteredQuotes.length - 1);
        message.channel.send(filteredQuotes[index]);
    } 
    else 
    {
        var sarcasticResponses = [
            "Wow. That was a bad search, try again.",
            "Hot damn you suck at searching for quotes.",
            "Sverdlik would give you a 0/100 on that search.",
            "Not even our CS profs could come up with a quote that contains that weird-ass search.",
            "You really need to work on your searches.",
            "Roses are read, violets are blue, searching for valid quotes is something you can't really do.",
            "You should stick to whatever you were doing before you tried searching for whatever THAT was. Wow.",
            "Geez, I tried so hard to find a quote for that search but it was SO bad that even I couldn't find anything.",
            "I usually try to stay PG but holy $#|T that was an obscure search.",
            "You should really let someone who knows what they're doing search for quotes.",
            "Yeah I'm just gonna pretend I didn't see that horrible search you just did right there."
        ];
        message.channel.send(sarcasticResponses[getRandomInt(sarcasticResponses.length - 1)]);
    }
}

//Function for Teacher quotes list command
async function quoteList(message) 
{
    var quotes2 = jsonData.teacherQuotes;
    var filteredQuotes = []
    console.log(message.content);

    if(message.content.length > 10) //Runs if seaching for a specific keyword ONLY
    {
        var search = message.content.replace("!quotelist ", "");

        quotes2.forEach(function(quote) 
        {
            if (quote.toLowerCase().includes(search.toLowerCase() )) 
            {
                filteredQuotes.push(quote);
            }
        });  
    } 
    else 
    {
        filteredQuotes = quotes2;
    }
    if (filteredQuotes.length > 0) 
    {
        var reply = "";
        filteredQuotes.forEach(function (quote) {
            reply += quote + "\n\n";
        });
        // reply += "```";
        fs.writeFileSync("../tempQuotesList.txt", reply);

        const buffer = fs.readFileSync("../tempQuotesList.txt");

        const attachment = new MessageAttachment(buffer, 'quotesList.txt');

        message.channel.send("Here is a list of quotes matching your search:", attachment);
    } 
    else 
    {
        var sarcasticResponses = [
            "Wow. That was a bad search, try again.",
            "Hot damn you suck at searching for quotes.",
            "Sverdlik would give you a 0/100 on that search.",
            "Not even our CS profs could come up with a quote that contains that weird-ass search.",
            "You really need to work on your searches.",
            "Roses are read, violets are blue, searching for valid quotes is something you can't really do.",
            "You should stick to whatever you were doing before you tried searching for whatever THAT was. Wow.",
            "Geez, I tried so hard to find a quote for that search but it was SO bad that even I couldn't find anything.",
            "I usually try to stay PG but holy $#|T that was an obscure search.",
            "You should really let someone who knows what they're doing search for quotes.",
            "Yeah I'm just gonna pretend I didn't see that horrible search you just did right there."
        ];
        message.channel.send(sarcasticResponses[getRandomInt(sarcasticResponses.length - 1)]);
    }
}

async function quotecounter(message)
{
    var counter = Object.keys(jsonData.teacherQuotes).length;

    message.channel.send(`There are currently ${counter} quotes in file`);
}

//Writes messages from the quotes channel into the quotes-approval channel
async function quotecatcher(message, client)
{
    //Adds a new line to the incommingcsquotes CATCH ALL file
    fs.appendFile('incommingcsquotes.txt', "\n", (err) => {
        if (err) throw err;
    });

    //Adds the incomming, unapproved "CS QUOTE" to the CATCH ALL
    fs.appendFile('incommingcsquotes.txt', JSON.stringify(message.content), 'utf8', (err) => {
        if (err) throw err;
    });

    const regex = new RegExp('([\"\'].+[\'\"])+( *)(-+)( *)(.+)');
                            //Ignore errors here

    if (regex.test(message.content)) {
        approveQuote(message.content, client);
    }
}

//Code for approving a new professor quote and writing it into the quotes JSON file
async function approveQuote(quote, client) 
{
    client.channels.cache.get(`${contentapprovalchannel}`).send(quote)
        .then(function (message) {
            message.react('👍').then(() => message.react('👎'));

            var modUsers = {}
            message.guild.roles.cache.forEach(role => modUsers[role.name] = role.members);

            var modIds = [];
            modUsers[modrole].forEach(user => modIds.push(user['id']));
            const filter = (reaction, user) => {
                return ['👍', '👎'].includes(reaction.emoji.name) && modIds.includes(user.id);
            };

            message.awaitReactions(filter, { max: 1 })
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '👍') {
                        message.channel.send(`You have approved the quote.... ${quote}`);

                        jsonData['teacherQuotes'].push(message.content);

                        jsonData.save();

                    } else {
                        message.channel.send('You have disapproved the quote.');
                    }
                })
        });
}
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = { quote, quotecatcher, approveQuote, getRandomInt, quotecounter, quoteList };