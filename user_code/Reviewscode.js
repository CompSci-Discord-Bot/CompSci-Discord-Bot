//Reviewscode.js
const { modrole, contentapprovalchannel, proftalkchannel, modbotcommands, botcommands }= require('../ids.json');
const Entertainment = require("./Entertainment");
const fs = require('fs');
let jsonData = "";

//Code to add a professor rating 
async function RateProfessor(message, client)
{
    var arg = message.content.slice(6).trim();
    var profname = (arg.substr(0,arg.indexOf(' ')).toLowerCase());

    fs.readFile('./logs/professors/professors.txt', function (err, data) 
    {
        if (err) throw err;
        if (data.includes(profname))
        {
            var review = arg.substr(arg.indexOf(' ')+1);

            var file = ('./logs/professors/' + profname.toLowerCase() + '.txt').toString().split("\n");
            message.channel.send(`Submitting review for mod review!  Thanks for taking the time to submit a review!`);
            approveReview(message, review, client, file, profname);
        }
        else 
        {
            message.channel.send("Sorry, that professor does not exist!");
        }
    });
}

//Code for approving a new professor review
async function approveReview(message, review, client, file, profname) 
{
    client.channels.cache.get(`${contentapprovalchannel}`).send(`Review for ${profname} ---> `+review)
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

                    if (reaction.emoji.name === '👍') 
                    {
                        message.channel.send('You have approved the review!');
                        console.log('Appending review to '+file+'--->'+review); //DO NOT REMOVE THIS CONSOLE LOG!
                        fs.appendFile(`${file}`,"\n"+"\n"+JSON.stringify(`${review}`), 'utf8', (err) => {
                            if (err) throw err;
                        });
                    } 
                    else 
                    {
                        message.channel.send('You have disapproved the review.');
                        file = ('./logs/professors/trashdump.txt').toString().split("\n");
                        fs.appendFile(`${file}`,"\n"+`Declined review for ${profname} ---> `+JSON.stringify(`${review}`), 'utf8', (err) => {
                            if (err) throw err;
                        });
                        return;
                    }
                })
        });
}

function collectRatings(char_count, num, arr) {
    var out;
    var temp = char_count;
    offset = 2;
    for (e = 0; e < num; e++) {
        out = "";
        char_count = temp;
        for (i = offset; i < arr.length && char_count < 500; i++) 
        {
            if (char_count + arr[i] >= 500) break;
            if (e > 0) console.log(i);
            if (arr[i]) 
            {
                out = out + "\n" + arr[i];
                char_count = out.length;
            }
            offset++
        }
    }
    return out;
}

//Code to retrieve all written professor ratings from their respective txt file and list them in Discord
async function viewRatings(message, Discord)
{   
    if((message.channel.id === `${proftalkchannel}`) || (message.channel.id === `${botcommands}`)|| (message.channel.id === `${modbotcommands}`))
    {
        var viewprofName = message.content.slice(12).trim().toString();
        if (viewprofName.localeCompare("")==0)
        {
            message.channel.send("I don't know what Professor's ratings to give if you don't specify a Professor's name first, silly goose.");
            return;
        }
        fs.readFile('./logs/professors/professors.txt', function (err, data) 
        {
            if (err) throw err;
            if(data.includes(viewprofName.toLowerCase())){
                fs.readFile('./logs/professors/' + viewprofName.toLowerCase() + '.txt', 'utf8', function(err, data) {
                    if (err) throw err;

                    var arr = data.split("\n");
                    
                    
                    var titleout = "Ratings for Professor " + viewprofName;
                    var char_count = titleout.length;
                    var out = collectRatings(char_count, 1, arr);

                    const author = message.author;
                    
                    message.channel.send(Entertainment.embed(Discord, titleout, 'Almighty CompSci', '34EB5E', 'Page 1', out)).then(message => {
                        let page = 1;

                        if (collectRatings(char_count, page+1, arr)) message.react('➡️')

                        const collector = message.createReactionCollector(
                            // only collect left and right arrow reactions from the message author
                            (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
                            // time out after a minute
                            {time: 60000}
                        )

                        collector.on('collect', reaction => {
                            // remove the existing reactions
                            message.reactions.removeAll().then(async () => {
                                // increase/decrease index
                                reaction.emoji.name === '⬅️' ? page -= 1 : page += 1
                                char_count = titleout.length;
                                console.log(collectRatings(char_count, page, arr));
                                // edit message with new embed
                                message.edit(Entertainment.embed(Discord, titleout, 'Almighty CompSci', '34EB5E', `Page ${page}`, collectRatings(char_count, page, arr)))
                                // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                                if (collectRatings(char_count, page-1, arr)) await message.react('⬅️')
                                // react with right arrow if it isn't the end
                                if (collectRatings(char_count, page+1, arr)) message.react('➡️')
                            })
                        })
                    });
                });
                //message.channel.send("Ratings for Professor " + viewprofName, { files: ['./logs/professors/' + viewprofName.toLowerCase() + '.txt'] });
                message.channel.send("Ratings for Professor " + viewprofName, { files: ['./logs/professors/' + viewprofName.toLowerCase() + '.txt'] });
            }
            else 
            {
                message.channel.send("Sorry, that professor does not exist!")
            }
        });
    }
    else
    {
        console.log(message.author.username+` tried using viewratings in `+message.channel.name);
        message.channel.send(`Command only allowed in prof-talk-and-suggestions and bot-commands`);
    }
}


module.exports = { RateProfessor, approveReview, viewRatings };