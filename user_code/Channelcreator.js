const { prefix } = require('../config.json')
const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline');

function csvparse(message)
{
    categorycreator(message);
    fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => { 
    var Subj =  `${row["Subj"]}`;
    var Crse =  `${row["Crse"]}`;
    var time =  `${row["Time"]}`;
    var name =  `${row["Instructor"]}`;
    var instructorarray = name.replace("(P)", "").trim().split(" ");
    var lastnamepos = (instructorarray.length -1);
    var channelname = `${Subj}-${Crse}-${instructorarray[lastnamepos]}`;
    var rolename =  `${Subj} ${Crse}`;

    createchannel(channelname,message,time)//creates and sorts the channels
    })

    .on('end', () => {
    console.log("CSV file successfully processed");
        
    });
}
function categorymatcher(message,rolename){//create categories first, then as channels are created match them
    message.guild.channels.cache.forEach(channel => { 
        if(channel.type==='category'&&`${channel}`.includes(rolename)){
            console.log("match")
        };
    });
}
function categorycreator(message)
{  
    const readInterface = readline.createInterface({
        input: fs.createReadStream('./categories.txt'),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', function(line) 
    {
        var semester = ('Summer 2021')
        message.guild.channels.create(`${line} ${semester}`, { type: 'category' })
    });    
}

    //creates individual and csv channels
    //individuals aren't sorted, name can be customized by 'cc' command
    //csvparse are sorted
    //DOES NOT SORT MATH ELECTIVE OR NON CODED CLASSES (e.g. "eta-bahorski")
function createchannel(name, message,time)
{
    message.guild.channels.create(name, { reason: 'Needed a cool new channel' })//creates new channel
        .then(channel => 
            {//given the created channel
            
            //gets class code from channel name (103, 311, etc)
            var code=channel.name.substr(5,3); 
            
            //eliminates --Duplicate classes-- or --Online labs-- to 111 or 211 classes, as well as graduate classes
            if(code.includes("112")||code.includes("212"))
            {
                channel.delete();//deletes them
            }

            //Sets the channel topic of the channel to the class time.
            //Time grabbed from the passed in parameter time from csvparse function
            if(time=="TBA")
                console.log(name + " IS CURRENTLY SET TO TBA, THIS CLASS MAY NEED TO BE UPDATED LATER")
            else
                channel.setTopic(time)


            //searches for a category that fits different specs to sort
            message.guild.channels.cache.forEach(category => 
            {
                //finds category COSC ELECTIVES and sorts the elective classes into them (all classes not in categories.txt)
                if(category.type==='category'&& category.name.includes("COSC XXX Electives")&&(code.includes("321")||code.includes("374")||code.includes("423")||code.includes("426")||code.includes("436")||code.includes("444")||code.includes("457")||code.includes("461")||code.includes("462")||code.includes("472")||code.includes("473")||code.includes("480")||code.includes("439")||code.substr(0,1).includes("5")||code.substr(0,1).includes("6")))
                {
                    channel.setParent(category.id);
                    return;
                }

                if(category.type==='category'&& category.name.includes("COSC Mathematics Courses")&&(name.includes("MATH 321")||name.includes("MATH 120")||name.includes("MATH 360")))
                {
                    channel.setParent(category.id);
                    return;
                }

                //if category and class channel share same code (for most required and gen ed classes)
                else if(category.type==='category'&& `${category.name}`.includes(code))
                {
                    channel.setParent(category.id);
                    return;
                }   
            })}).catch(console.error);        
}

async function deletechannel(message)
{
    message.guild.channels.cache.forEach(channel => {
        //ignores:references, github, devwork, classic-quotes,bot-status, voice, devtalk, content approval, and general

        if((channel.id!==('823034099925123092') && channel.id!==('823034119167672340') && channel.id!==('823034112155189268') && channel.id!==('823034145868349470')&& channel.id!==('838150077834854411')&& channel.id!==('838149486353842198')&& channel.id!==('838195992624103475')&& channel.id!==('841873032011055114')&& channel.id!==('841424759128588369')&& channel.id!==('823034099925123092'))){
        channel.delete()}});
}

function deletecategory(message)
{
    message.guild.channels.cache.forEach(category => {
        if(category.id !== ('823029672630943757'))
        {
        category.delete()}});
}

async function swapper(name, message)
{
    let category = message.guild.channels.cache.find(c => c.name == "Text Channels" && c.type == "category"),
    channel = message.guild.channels.cache.find(c => c.name == `${name}` && c.type == "text");
  
  if (category && channel) channel.setParent(category.id);
  else console.error(`One of the channels is missing:\nCategory: ${!!category}\nChannel: ${!!channel}`);
}


async function channelsort(message)
{
    var textchannels = {} = message.guild.channels.cache.forEach(c => c.type == "text");

}

async function rolecreator(message)
{  
    const readInterface = readline.createInterface({
        input: fs.createReadStream('./categories.txt'),
        output: process.stdout,
        console: false
    });

    readInterface.on('line', function(line) 
    {
        var semester = ('Fall 2021')
        message.guild.roles.create({
            data: {
              name: `${line} ${semester}`,
              color: 'BLUE',
            },
            reason: 'idfk',
          })
    });    
}

module.exports = { csvparse, createchannel, deletechannel, categorycreator, deletecategory, swapper, channelsort, rolecreator};
