//Quotescode.js
const { modrole, approveQuotesChannel }= require('../ids.json');
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

//Function for Teacher quotes command!  DO NOT REMOVE
async function quote(message) 
{
    var quotes2 = jsonData.teacherQuotes;
    var filteredQuotes = []
    console.log(message.content);
    if (message.content.length > 6) {
        var search = message.content.replace("!quote ", "");

        quotes2.forEach(function(quote) {
            if (quote.toLowerCase().includes(search.toLowerCase() )) {
                filteredQuotes.push(quote);
            }
        });  
    } else {
        filteredQuotes = quotes2;
    }
    
    if (filteredQuotes.length > 0) {
        var index = getRandomInt(filteredQuotes.length - 1);
        message.channel.send(filteredQuotes[index]);
    } else {
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
        message.reply(sarcasticResponses[getRandomInt(sarcasticResponses.length - 1)]);
    }
}

//Writes messages from the quotes channel into the quotes-approval channel
async function quotecatcher(message, client)
{
    fs.appendFile('incommingcsquotes.txt', "\n", (err) => {
        if (err) throw err;
    });

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
    client.channels.cache.get(`${approveQuotesChannel}`).send(quote)
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
                        message.channel.send('You have approved the quote!');

                        var name = './logs/quotes.json';
                        var json = JSON.parse(fs.readFileSync(name).toString());
                        json['teacherQuotes'].push(message.content)

                        fs.writeFileSync(name, JSON.stringify(json));

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

module.exports = { quote, quotecatcher, approveQuote, getRandomInt };