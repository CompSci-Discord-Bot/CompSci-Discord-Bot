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

// Code to submit a request to remove a professor review by review index
async function removeRating(message, client) {
    // Formatting: !removep professor_name review_index
    var args = message.content.split(" "); 

    if (args.length != 3) {
        message.channel.send("Invalid formatting. Please format as !removep professor_name review_index.");
        return;
    }

    var profName = args[1];
    var reviewIndex = parseInt(args[2]);
    
    // Attempt to open file of professor - lowercase necessary
    let file = `./logs/professors/${profName.toLowerCase()}.txt`;

    fs.readFile(file, function (err, data) {

        if (err) {
            message.channel.send("This professor name is invalid.");
            return;
        }  
        // Split the file into a string array on "\n"
        // This will include white space entires
        var tmpReviews = data.toString().split("\n");

        // Clean up the tmpReviews array into only reviews
        var reviews = [];

        for (var i = 1; i < tmpReviews.length; i++) {
            if (tmpReviews[i].trim() === "") {
                continue;
            }
            reviews.push(tmpReviews[i]);
        }

        // If the file only contains "Student Ratings for....", return
        if (reviews.length == 0) {
            message.channel.send("No reviews exist for this professor.");
            return;
        }

        // If the reviewIndex provided is invalid, return
        if (reviewIndex < 0 || reviewIndex > reviews.length - 1) {
            message.channel.send("Invalid index provided; reviews begin at index 0.");
            return;
        }
        // Else, reviewIndex is valid: invoke approveRemoval
        // TEMPORARY DEBUG
        message.channel.send(`Review to be removed identified as ${reviews[reviewIndex]}`);
        // THIS IS TO-DO approveRemoval(reviews[reviewIndex], client, file, profName);
    });
}

// Review request to remove a review
// Provided the message, the review contents, the index of the review, client, file, and profName
async function approveRemoval(review, client, file, profname) {
    client.channels.cache.get(`${contentapprovalchannel}`).send(`Request to remove review for ${profname} ---> ${review}`)
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
                        message.channel.send('You have approved the request to remove the review!');
                        console.log('Removing review from '+file+'--->'+review);
                        fs.readFile(file, function (err, data) {
                            if (err) throw error
                            let reviews = data.toString().split("\n\n");
                            for (var i = 1; i < tmp_reviews.length; i++) {
                                // Normalized used due to: www.javascripttutorial.net/string/javascript-string-equals/
                                if (reviews[i].normalize() === review.normalize()) {
                                    // The review to be removed has been identified
                                    // TO-DO, remove from file
                                }

                            }
                        });
                    } 
                    else 
                    {
                        message.channel.send('You have disapproved the request to remove the review');
                        return;
                    }
                })
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


module.exports = { RateProfessor, approveReview, removeRating, approveRemoval, viewRatings };