//Reviewscode.js
const { modrole, contentapprovalchannel, proftalkchannel, modbotcommands, botcommands }= require('../ids.json');
const { devstate }= require('../config.json');
const fs = require('fs');
let jsonData = "";

// Code to submit a request to remove a professor review by review index
async function removeRating(message, client) {
    // Formatting: !removerating professor_name review_index
    var args = message.content.split(" "); 

    if (args.length != 3) {
        message.channel.send("Invalid formatting. Please format as !removerating professor_name review_index.");
        return;
    }

    var profName = args[1];
    var reviewIndex = parseInt(args[2]) + 1; // Shift necessary due to first line of file
    
    // Attempt to open file of professor - lowercase necessary
    let file = `./logs/professors/${profName.toLowerCase()}.txt`;

    fs.readFile(file, function (err, data) {
        if (err) {
            message.channel.send("This professor name is invalid.");
            return;
        }  
        // Split the file into a string array on "\n"
        // This will include white space entires
        let reviews = parseReviewsToArr(data);

        // If the file only contains "Student Ratings for....", return
        if (reviews.length <= 1) {
            message.channel.send("No reviews exist for this professor.");
            return;
        }

        // If the reviewIndex provided is invalid, return
        if (reviewIndex < 1 || reviewIndex > reviews.length) {
            message.channel.send("Invalid index provided; reviews begin at index 0.");
            return;
        }
        // Else, reviewIndex is valid: invoke approveRemoval
        message.channel.send(`Submitting request to remove review: ${reviews[reviewIndex]}`);
        approveRemoval(message, reviews[reviewIndex], client, file, profName);
    });
}

/* Review request to remove a review
// Provided the message, the review contents, the index of the review, client, file, and profName */
async function approveRemoval(incommingMessageObject, review, client, file, profname) {
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
                        incommingMessageObject.channel.send('Review removal for '+profname+' Accepted!');
                        fs.readFile(file, function (err, data) {
                            // The review is confirmed to exist in the message again, and the index found from review contents
                            // This is to prevent issues if file was modified after request was placed
                            let reviews = parseReviewsToArr(data)
                            var reviewFound = false; // To prevent removing duplicates and to inform in case of error
                            var newFile = "";
                            for (var i = 0; i < reviews.length; i ++) {
                                if (reviews[i] === review && !reviewFound) {
                                    reviewFound = true;
                                    continue;
                                }
                                newFile += reviews[i] + "\n\n";
                            }
                            if (!reviewFound) {
                                message.channel.send('The review was not found in the file, it may have been removed since the request was placed.');
                            } else {
                            fs.writeFile(file, newFile, 'utf8', (err) => {
                                if (err) throw err;
                            });
                        }
                        });
                    } 
                    else 
                    {
                        message.channel.send('You have disapproved the request to remove the review');
                        incommingMessageObject.channel.send('Review removal for '+profname+' Denied!');
                        return;
                    }
                })
        });
}

// Provided data which are reviews separated by a new line character, return a clean array of string reviews
function parseReviewsToArr(data) {
    var tmpReviews = data.toString().split("\n");

    // Clean up the tmpReviews array into only reviews
    var reviews = [];
    for (var i = 0; i < tmpReviews.length; i++) {
        if (tmpReviews[i].trim() === "") {
            continue;
        }
        reviews.push(tmpReviews[i]);
    }

    return reviews;
}

// Code to add a professor rating 
async function RateProfessor(message, client)
{
    // Remove !ratep from the message
    var arg = message.content.slice(6).trim();
    // Extract the professor name from the message
    var profName = (arg.substr(0,arg.indexOf(' ')).toLowerCase());

    // This error will occur both if they didn't add a review or if they only inputed !ratep
    if (profName.trim() == "") {
        message.channel.send(`**Error:** You must include a professor's name and a review.\nPlease use the format \`!ratep professor_name Type your review here\``)
        return
    }

    fs.readFile('./logs/professors/professors.txt', function (err, data) 
    {
        if (err) throw err;
         // Parse data along new line into a list of strings
         var professors = data.toString().split("\n");
         // Determine how similar user input is to an existing professor
         searchSimilarity(
             professors,
             profName,
             // If exact match - proceed with approval
             onExact = (professor) => {
                var review = arg.substr(arg.indexOf(' ')+1);
                var file = ('./logs/professors/' + professor + '.txt').toString().split("\n");
                message.channel.send(`Submitting review for mod review!  Thanks for taking the time to submit a review!`)
                approveReview(message, review, client, file, professor); 
             },
             // Else, if similar, inform the user of correct spelling but do not proceed with approval
             onSimilar = (userInput, professor) => message.channel.send(`Sorry, **${userInput}** does not exist in our system! Did you mean **${professor}**?`),
             onNone = (userInput) => message.channel.send(`Sorry, no professor with a name of or similar to **${userInput}** exists in our system!`)
        )
    })
}

//Code for approving a new professor review
async function approveReview(incommingMessageObject, review, client, file, profname) 
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
                        incommingMessageObject.channel.send('Review for '+profname+' Accepted!');
                        fs.appendFile(`${file}`,"\n"+"\n"+JSON.stringify(`${review}`), 'utf8', (err) => {
                            if (err) throw err;
                        });
                    } 
                    else 
                    {
                        message.channel.send('You have disapproved the review.');
                        file = ('./logs/professors/trashdump.txt').toString().split("\n");
                        incommingMessageObject.channel.send('Review for '+profname+' Denied!');
                        fs.appendFile(`${file}`,"\n"+`Declined review for ${profname} ---> `+JSON.stringify(`${review}`), 'utf8', (err) => {
                            if (err) throw err;
                        });
                        return;
                    }
                })
        });
}


//-----============== EVERYTHING BELOW THIS POINT IS FOR VIEWING RATINGS ONLY!  IT IS NOT USED FOR ANYTHING ELSE ==============-----
// Code to retrieve all written professor ratings from their respective txt file and list them in Discord
async function viewRatings(message) 
{   
    if((message.channel.id === `${proftalkchannel}`) || (message.channel.id === `${botcommands}`)|| (message.channel.id === `${modbotcommands}`) || (`${devstate}` == 'true'))
    {
        var viewprofName = message.content.slice(12).trim().toString();
        if (viewprofName.localeCompare("") == 0)
        {
            message.channel.send(`**Error:** You must include a professor's name.\nPlease use the format \`!viewratings professor_name\``)
            return;
        }
        
        fs.readFile('./logs/professors/professors.txt', function (err, data) 
        {
            if (err) throw err;
            // Parse data along new line into a list of strings
            var professors = data.toString().split("\n");
            // Determine how similar user input is to an existing professor
            searchSimilarity(
                professors,
                viewprofName,
                onExact = (professor) => message.channel.send("Ratings for Professor " + professor, { files: ['./logs/professors/' + professor + '.txt'] }),
                onSimilar = (userInput, professor) => {
                    message.channel.send(`Sorry, **${userInput}** does not exist in our system! Did you mean **${professor}**?`)
                    message.channel.send("Ratings for Professor " + professor, { files: ['./logs/professors/' + professor + '.txt'] });
                },
                onNone = (userInput) => message.channel.send(`Sorry, no professor with a name of or similar to **${userInput}** exists in our system!`)
            )
        });
    }
    else
    {
        console.log(message.author.username+` tried using viewratings in `+message.channel.name);
        message.channel.send(`Command only allowed in prof-talk-and-suggestions and bot-commands`);
    }
}

// Function to search a list of professors for a user input with callbacks dependent on result
function searchSimilarity(professors, userInput, onExact, onSimilar, onNone) {
        // Iterate through each professor, find which most similar to user input
        var maxSimilarityProf = ""
        var maxSimilarityValue = 0
        
        professors.forEach(professor => {
            var similarityVal = similarity(professor.toLowerCase().trim(), userInput.toLowerCase().trim())
                if (similarityVal > maxSimilarityValue) {
                    maxSimilarityValue = similarityVal
                    maxSimilarityProf = professor.trim().toLowerCase()
                }
            }
        );
        // Callback dependent on how similar input was to a professor
        if (maxSimilarityValue == 1) onExact(maxSimilarityProf)
        else if (maxSimilarityValue > 0.35) onSimilar(userInput.trim().toLowerCase(), maxSimilarityProf)
        else onNone(userInput.trim().toLowerCase())
}

// HELPER FUNCTIONS TO DETERMINE HOW SIMILAR A STRING IS TO ANOTHER STRING
// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
// https://en.wikipedia.org/wiki/Levenshtein_distance
function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }


module.exports = { RateProfessor, approveReview, removeRating, approveRemoval, viewRatings };