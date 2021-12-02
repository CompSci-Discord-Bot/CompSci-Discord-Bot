//Reviewscode.js
const { modrole, contentapprovalchannel, proftalkchannel, modbotcommands, botcommands }= require('../ids.json');
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

// Code to submit a request to remove a professor review by index
async function removeRating(message, client) {

    var arg = message.content.slice(8).trim(); // Removes the !removep from the message
    var args = arg.split(" "); // Formatting: !removep professor_name index
    var profName = args[0];
    var reviewIndex = parseInt(args[1]) + 1; // + 1 offset to filter first line from file

    // Open file of valid professors
    fs.readFile('./logs/professors/professors.txt', function (err, data) {
        if (err) throw err;
        
        // If the prof exists, open the reviews within
        if (data.includes(profName)) {    
            fs.readFile('./logs/professors/' + viewprofName.toLowerCase() + '.txt', function (err, data) {
                if (err) throw err;
                // Split the file into a string array on "\n\n"
                let reviews = data.split("\n\n");
                // If the file only contains "Student Ratings for....", return
                if (reviews.length < 2) {
                    message.channel.send("No reviews exist for this professor.");
                    return;
                }
                // If the reviewIndex provided is invalid
                if (reviewIndex < 0 || reviewIndex > reviews.length - 1) {
                    message.channel.send("Invalid index.");
                    return;
                }
                approveRemoval(message, reviews[reviewIndex], reviewIndex, client, profName);
            });
        } else {
            message.channel.send("Invalid professor. Please format as !removep professor_name review_index");
        };
    })
}

async function approveRemoval(message, review, index, client, file, profname) {
    // TO-DO
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

//Code to retrieve all written professor ratings from their respective txt file and list them in Discord
async function viewRatings(message) 
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