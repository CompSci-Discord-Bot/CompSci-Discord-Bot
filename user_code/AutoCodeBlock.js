function autoCodeBlock(message) {
    const regex = new RegExp('({[^]*})');

    //If there is a matching set of brackets - might be code
    if (message.content.match(regex) && message.content.match(regex).length > 0) {
        if (!message.content.includes("```") || message.content.includes("```\n")) {
            var messageContent = message.content.replace(/```/g, "");
            var reply = "It seems like that message might contain some unformatted code, I did my best to format it for you. If this is unwanted, click the thumbs down and this will be deleted.";
    
            //Doing this in a few lines for readability
            reply += "\n```java\n";
            reply += messageContent;
            reply += "\n```\n";
            reply += "(If you are curious how to do this, check out https://www.codegrepper.com/code-examples/whatever/discord+syntax+highlighting)";
            reply += `Original Message sent by: ${message.author.username}`;
            
            //Add thumbs down and wait for it
            message.channel.send(reply).then(function (message) {
                message.react('👎');
    
                const filter = (reaction, user) => {
                    return ['👎'].includes(reaction.emoji.name) && !user.bot;
                };
    
                message.awaitReactions(filter, { max: 1 })
                    .then(collected => {
                        const reaction = collected.first();
    
                        //Thumbs down was added by someone not a bot, delete message
                        if (reaction.emoji.name === '👎') {
                            message.delete();
                        }
                    })
            });
        }
    }
    
}

module.exports = { autoCodeBlock };