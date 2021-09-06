const Discord = require("discord.js")
const client = new Discord.Client()
const settings = require("./auth.json");
const chalk = require("chalk");
const fs = require("fs");
const moment = require("moment");
require("./utils/eventLoader")(client);
const db = require("quick.db");
const path = require('path');
const utf8 = require("utf8");
const ms = require("ms");

const YouTube = require("simple-youtube-api");
const token = settings.token;
const ytdl = require("ytdl-core");

require("./modules/music.js")(client);

if (settings.musicEnabled === "true") {
  client.musicQueue = new Map();

  client.YouTube = new YouTube("AIzaSyBXC1oxZ6ownCwAa7CgkLdlvTpLc5eG2uA");
  client.ytdl = ytdl;
}

client.config = {
  prefix: process.env.PREFIX,
  SOUNDCLOUD: process.env.SOUNDCLOUD_CLIENT_ID
}

//Loading Events
fs.readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(__dirname + `/events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    console.log("Loading Event: "+eventName)
  });
});



const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);

  
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} Loading...`);

  files.forEach(f => {
    let props = require(`./commands/${f}`);
   log(`Loaded: ${props.help.name}.`);
   client.commands.set(props.help.name, props);
  });
});



client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
    TOKEN: 'ODY5MzEzNzE2NDQ4MDE0MzU4.YP8ZfQ.r5MG0VgM3UDVmwsOj0wFvuU8Ko4',    
    YT_API_KEY: 'AIzaSyAS6VZVvKqIjFsLTo1hTdwOV_TxApOzvOk ', 
    prefix: '-',
    devs: ['Already In']
}

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./commands/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};


client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
};
var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

// client.on('debug', e => {
//  console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
//  });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});



client.login(settings.token);

// const { Client, RichEmbed } = require('discord.js');
// const Discord = require('discord.js');
// const client = new Client();
// const auth = require('./auth.json');
// const fs = require ('fs');
// const moment = require("moment");
// const chalk = require("chalk");

//function shuffle(array) {
  //var currentIndex = array.length, temporaryValue, randomIndex;
  
 //  // While there remain elements to shuffle...
  // while (0 !== currentIndex) {

   // // Pick a remaining element...
     //randomIndex = Math.floor(Math.random() * currentIndex);
     //currentIndex -= 1;
    // And swap it with the current element.
    //temporaryValue = array[currentIndex];
     //array[currentIndex] = array[randomIndex];     array[randomIndex] = temporaryValue;
  //}
  //return array;
// };

// require('./utils/eventLoader.js')

// function checkDays(date) { let now = new Date(); let diff = now.getTime() - date.getTime(); let days = Math.floor(diff / 86400000); return days + (days == 1 ? " day" : " days") + " ago"; };

// client.on('ready', () => {
//   console.log(`Connected! | Logged in as ${client.user.tag} (${client.user.id}) on ${client.guilds.size} server(s)!`);
//   client.user.setStatus('available');
//     client.user.setPresence({
//       game: {
// 		      name: '-help | Made by Doodle#8133',
//           type: "PLAYING",
//           url: "https://roblox.com"
//         }
//     });
// });

// const log = message => {
//   console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);

  
// };

// client.commands = new Discord.Collection();
// client.aliases = new Discord.Collection();
// fs.readdir("./commands/", (err, files) => {
//   if (err) console.error(err);
//   log(`${files.length} Loading...`);
//   files.forEach(f => {
//     let props = require(`./commands/${f}`);
//     log(`Loaded: ${props.help.name}.`);
//     client.commands.set(props.help.name, props);
//   });
// });

// client.reload = command => {
//   return new Promise((resolve, reject) => {
//     try {
//       delete require.cache[require.resolve(`./commands/${command}`)];
//       let cmd = require(`./commands/${command}`);
//       client.commands.delete(command);
//       client.aliases.forEach((cmd, alias) => {
//         if (cmd === command) client.aliases.delete(alias);
//       });
//       client.commands.set(command, cmd);
//       cmd.conf.aliases.forEach(alias => {
//         client.aliases.set(alias, cmd.help.name);
//       });
//       resolve();
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

// client.load = command => {
//   return new Promise((resolve, reject) => {
//     try {
//       let cmd = require(`./commands/${command}`);
//       client.commands.set(command, cmd);
//       cmd.conf.aliases.forEach(alias => {
//         client.aliases.set(alias, cmd.help.name);
//       });
//       resolve();
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

// client.unload = command => {
//   return new Promise((resolve, reject) => {
//     try {
//       delete require.cache[require.resolve(`./commands/${command}`)];
//       let cmd = require(`./commands/${command}`);
//       client.commands.delete(command);
//       client.aliases.forEach((cmd, alias) => {
//         if (cmd === command) client.aliases.delete(alias);
//       });
//       resolve();
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

// client.elevation = message => {
//   if (!message.guild) {
//     return;
//   }
// };
// var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

// // client.on('debug', e => {
// //  console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// //  });

client.login('ODY5MzEzNzE2NDQ4MDE0MzU4.YP8ZfQ.r5MG0VgM3UDVmwsOj0wFvuU8Ko4');
















