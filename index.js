process.setMaxListeners(0);
require("dotenv").config();
const Discord = require("discord.js");
const ms = require("ms");
const { parse } = require('twemoji-parser');
const client = new Discord.Client();
const line = "https://cdn.discordapp.com/attachments/820974861064470608/850028958140858378/Discord_Stripe_221212asdasdasdasd3221.png";
const fs = require("fs");
const db = require("quick.db")
const fetch = require('node-fetch')
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("DB CONNECTED!"))
  .catch(e => console.log("DB ERROR!"));
const color = "#7921FF";
const prefix = '=';
client.on("ready", async () => {
  client.user.setActivity("BanderitaX", {
    type: "STREAMING",
    url: "https://www.twitch.tv/banderitax"
  })
  console.log("the client is ready!");
})

try {
  let file = fs.readFileSync(__dirname + "/info.js");
  fs.writeFileSync(__dirname + "node_modules/ytdl-core/lib/info.js", file);
} catch (error) {
  console.log(error);
}


client.on("message", async message => {
  if (message.channel.type === "dm") return
  if (message.guild.id !== "690961823121408022") return
  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.content.startsWith(`https://discord.com/channels/${message.guild.id}`)) {
    let slashes = message.content.split("/");
    let mid = slashes[slashes.length - 1];
    let cid = slashes[slashes.length - 2]
    message.guild.channels.cache.get(cid).messages.fetch(mid).then(async msg => {
      message.delete()
      if (msg.attachments) {
        let attEmbed = new Discord.MessageEmbed()
          .setTitle("**Message Info :**")
          .addFields({
            name: "Message Content :",
            value: `${msg.content || `[Click Here](${msg.url})`}\n[Jump To Message](${msg.url})`,
            inline: true
          }, {
              name: "Sent By :",
              value: `${msg.author}`,
              inline: true
            }, {
              name: "Channel :",
              value: `${msg.channel}`
            })
          .setColor(color)
          .setTimestamp()
          .setAuthor(msg.author.tag, msg.author.displayAvatarURL({
            format: "png",
            size: 4096,
            dynamic: true
          }))
          .setFooter(message.author.tag, message.author.displayAvatarURL({
            format: "png",
            size: 4096,
            dynamic: true
          }))
        message.channel.send(attEmbed)
        msg.attachments.forEach((at) => message.channel.send({
          files: [at.url]
        }))
        return
      }
      let messageEmbed = new Discord.MessageEmbed()
        .setTitle("**Message Info :**")
        .addFields({
          name: "Message Content :",
          value: `${msg.content || `[Click Here](${msg.url})`}\n[Jump To Message](${msg.url})`,
          inline: true
        }, {
            name: "Sent By :",
            value: `${msg.author}`,
            inline: true
          }, {
            name: "Channel :",
            value: `${msg.channel}`
          })
        .setColor(color)
        .setTimestamp()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter(message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
      message.channel.send(messageEmbed)
    })
  }
});

const stickyTempModel = require("./models/stickyTemp");
var pp = '=';
var cc = '#7921FF';
client.on('message', message => {
  if (message.channel.type === 'dm') return;
  var prefix = db.fetch(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + 'setprefix')) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return;
    const args = message.content.split(' ').slice(1);
    if (!args[0]) return message.reply('**❌ Error Put The Prefix**');
    if (args[1])
      return message.reply(`**❌ Error You Can\'t Put a Double Arguments**`);
    if (args[0] === 'reset') return;
    if (args[0].length > 3)
      return message.reply(
        `**❌ Error You Can\'t Send Prefix More Than 3 Characters**`
      );
    db.set(`po_${message.guild.id}`, args[0]);
    message.reply(`**✅ Done The Prefix Set To \`${args[0]}\`**`);
  }
});

client.on("ready", () => {
  client.channels.cache.get("853392180437975083").send(`im ready`)
})
client.on("error", error => {
  client.channels.cache.get("853392180437975083").send(`There is Some Error\n\`\`\`\n${error}\n\`\`\``)
})

const DIG = require('discord-image-generation')
client.on('message', async message => {
  if (message.channel.type === "dm") return;
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  const argst = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = argst.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === "color") {
    var args = message.content.split(' ').slice(1)
    var color = args[0];
    var hexRegex = /^#([0-9a-f]{3}){1,2}$/i;
    if (!hexRegex.test(color)) return message.reply(`**❌ Error Invalid Hex Color**`);
    let img = await new DIG.Color().getImage(`${color}`);
    let attach = new Discord.MessageAttachment(img, 'Color.png');
    message.channel.send(attach);
  }
});

client.on("message", message => {
  if (message.channel.type === "dm") return;
  var prefix = db.fetch(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  const argst = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = argst.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === "embed") {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
    let args = message.content.split(' ').slice(1).join(' ');
    if (!args) return message.reply(`**❌ Error Please Put The JSON Embed Data**`);
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
    try {
      const json = JSON.parse(args);

      const { text = '' } = json;
      message.channel.send(text, {
        embed: json,
      });
    } catch (error) {
      message.reply(`**❌ Error Invalid JSON Data\n\`\`\`js\n${error}\n\`\`\`**`);
    };
  };
});

client.on("message", message => {
  if (message.channel.id === "744129474789900329" || message.channel.id === "788446329457737750") {
    if (!message.attachments.first()) return message.delete()
  }
})

client.on("message", message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`)
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "setcolor")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    const args = message.content.split(' ').slice(1)
    if (args[0] === "reset") return
    var hexRegex = /^#([0-9a-f]{3}){1,2}$/i;

    if (!hexRegex.test(args[0])) return message.reply(`**❌ Error Invalid Hex Color**`)
    db.set(`co_${message.guild.id}`, args[0])
    message.channel.send(`**✅ Done The Color Has Been Set To \`${args[0]}\`**`)
  }
})

const moment = require("moment");
const { EMSGSIZE } = require("constants");
client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  const argst = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = argst.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === "emojiinfo") {
    const args = message.content.split(' ').slice(1)
    const emote = args[0]
    if (!emote) return message.reply(`**❌ Error Please Put The Emoji**`);
    const regex = emote.replace(/^a?:\w+:(\d+)>$/, '$1')
    const emt = Discord.Util.parseEmoji(emote)
    if (emt) {
      const emoji = message.guild.emojis.cache.find((emj) => emj.name === emt.name || emj.id === regex)
      if (!emoji) return message.reply(`**❌ Error Invalid Emoji**`)
      const authorFetch = await emoji.fetchAuthor()
      const checkorCross = (bool) => bool ? '`✅`' : '`❌`'
      const emojiEmbed = new Discord.MessageEmbed()
        .setTitle(`**${emoji.name}**`)
        .addField("**🚀 Info :**", [
          `**Name : ${emoji.name}**`,
          `**ID : ${emoji.id}**`,
          `**Link : [URL](${emoji.url})**`,
          `**Created By : <@${authorFetch.id}>**`,
          `**Created At : ${moment(emoji.createdTimestamp).format('DD/MM/YYYY')} | ${moment(emoji.createdTimestamp).fromNow()}**`
        ], true)
        .addField("**🌍 Others :**", [
          `**Require Colons : ${checkorCross(emoji.requireColons)}**`,
          `**Deletable : ${checkorCross(emoji.deletable)}**`,
          `**Animated : ${checkorCross(emoji.animated)}**`
        ], true)
        .setThumbnail(emoji.url)
        .setColor(color)
        .setFooter(message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
      message.channel.send(emojiEmbed)
    }
  }
})

client.on("message", message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var col = db.get(`co_${message.guild.id}`);
  if (col === null) return
  if (message.content.startsWith(prefix + "setcolor reset")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    db.delete(`co_${message.guild.id}`, col)
    message.channel.send(`**✅ Done The Color Has Been Set To \`${color}\`**`)
  }
})

const invites = {};
const wait = require('util').promisify(setTimeout);
client.on('ready', () => {
  wait(1000);
  client.guilds.cache.forEach(king => {
    king.fetchInvites().then(guildInvites => {
      invites[king.id] = guildInvites;
    });
  });
});

client.on('message', async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "addemoji")) {
    const args = message.content.split(' ').slice(1)
    if (!message.member.hasPermission('MANAGE_EMOJIS')) return
    if (!message.guild.me.hasPermission('MANAGE_EMOJIS')) return
    const emoji = args.join("");
    if (!emoji) return message.reply("**❌ Error Please Put The Emoji**");
    let the_typed_emoji = Discord.Util.parseEmoji(emoji);
    if (the_typed_emoji.id) {
      const link = `https://cdn.discordapp.com/emojis/${the_typed_emoji.id}.${
        the_typed_emoji.animated ? 'gif' : 'png'
        }`;
      const name = args.slice(1).join(' ');
      message.guild.emojis.create(`${link}`, `${name || `${the_typed_emoji.name}`}`).then(emj => {
        return message.channel.send(`**✅ Done The Emoji ${emj} Has Been Added**`);
      })
    } else {
      let CheckEmoji = parse(emoji, { assetType: 'png' });
      if (!CheckEmoji[0])
        return message.reply(`**❌ Error Invalid Emoji**`);
      message.reply("**❌ Error Unknow Emoji**");
    }
  }
})

client.on('message', async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "sugadd")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let channel = message.mentions.channels.first()
    if (!channel) return message.reply("**❌ Error Please Mention The Channel**")
    let database = db.get(`sug_${message.guild.id}`)
    if (database && database.find(x => x.channel === channel.id)) return message.channel.send(`**❌ Error This Channel ${channel} Has Been Added Before**`)
    message.channel.send(`**✅ Done The Suggestion Channel Has Been Added To ${channel}**`);
    let data = {
      channel: channel.id
    }
    db.push(`sug_${message.guild.id}`, data)
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "sugremove")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let first = message.mentions.channels.first()
    if (!first) return message.reply("**❌ Error Please Mention The Channel**")
    let database = db.get(`sug_${message.guild.id}`)
    if (database) {
      let data = database.find(x => x.id === first.id)
      if (!data) return message.reply("**❌ Error Invalid Channel**")
      let value = database.indexOf(data)
      delete database[value]

      var filter = database.filter(x => {
        return x != null && x != ''
      })
      db.set(`sug_${message.guild.id}`, filter)
      message.channel.send("**✅ Done The Suggestion Channel Has Been Removed**")
    } else {
      message.reply("**❌ Error Invalid Channel**")
    }
  }
})

client.on("message", async message => {
  if (message.channel.id === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.content.startsWith(prefix + "suglist")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let database = db.get(`sug_${message.guild.id}`)
    if (!database) return message.reply("**❌ Error There is No Suggestions In This Server**")
    let list = []
    if (database && database.length) {
      database.forEach(x => {
        list.push(`**Channel : <#${x.channel}>**
`)
      })
      if (list.length === 0) return message.reply("**❌ Error There is No Suggestions In This Server**")
      let embed = new Discord.MessageEmbed()
        .setTitle(`**${message.guild.name} Suggestions**`)
        .setThumbnail(message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter(message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setColor(color)
        .setAuthor(message.guild.name, message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setDescription(list.join("\n\n"))
      message.channel.send(embed)
    }
  }
})

client.on('message', async msg => {
  if (msg.channel.type === 'dm') return;
  var prefix = db.get(`po_${msg.guild.id}`);
  if (prefix === null) prefix = pp;
  var color = db.get(`co_${msg.guild.id}`);
  if (color === null) color = cc;
  let sug = db.get(`sug_${msg.guild.id}`)
  if (sug) {
    if (msg.author.bot) return
    const chn = sug.find(x => x.channel === msg.channel.id)
    if (chn) {
      if (msg.content.startsWith(prefix)) return
      msg.delete()
      let embed = new Discord.MessageEmbed()
        .setAuthor("Suggested By : " + msg.author.tag, msg.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter(msg.author.id)
        .setDescription(`> ${msg.content.split("\n").join("\n> ")}`)
        .setThumbnail(msg.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setColor(color)
      msg.channel.send(embed).then(m => {
        m.react('<:Like_BNX:857678552840536065>').then(() => {
          m.react('<:Dislike_BNX:857679129351946280>')
        })
      })
    }
  }
})

client.on('message', async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "lineadd")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let channel = message.mentions.channels.first()
    if (!channel) return message.reply("**❌ Error Please Mention The Channel**")
    let line = message.content.split(' ').slice(2)
    if (!line[0]) return message.reply("**❌ Error Please Put The Line Link**")
    let database = db.get(`line_${message.guild.id}`)
    if (database && database.find(x => x.channel === channel.id)) return message.channel.send(`**❌ Error This Channel ${channel} Has Been Added Before**`)
    message.channel.send(`**✅ Done The Auto Line Has Been Added To ${channel} With Line :**`, { files: [line[0]] });
    let data = {
      channel: channel.id,
      line: line[0]
    }
    db.push(`line_${message.guild.id}`, data)
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "lineremove")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let first = message.mentions.channels.first()
    if (!first) return message.reply("**❌ Error Please Mention The Channel**")
    let database = db.get(`line_${message.guild.id}`)
    if (database) {
      let data = database.find(x => x.channel === first.id)
      if (!data) return message.reply("**❌ Error Invalid Channel**")
      let value = database.indexOf(data)
      delete database[value]

      var filter = database.filter(x => {
        return x != null && x != ''
      })
      db.set(`line_${message.guild.id}`, filter)
      message.channel.send("**✅ Done The Auto Line Has Been Removed**")
    } else {
      message.reply("**❌ Error Invalid Channel**")
    }
  }
})

client.on("message", async message => {
  if (message.channel.id === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.content.startsWith(prefix + "linelist")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let database = db.get(`line_${message.guild.id}`)
    if (!database) return message.reply("**❌ Error There is No Auto Line In This Server**")
    let list = []
    if (database && database.length) {
      database.forEach(x => {
        list.push(`**Channel : <#${x.channel}>**
> Line : ${x.line}
`)
      })
      if (list.length === 0) return message.reply("**❌ Error There is No Auto Line In This Server**")
      let embed = new Discord.MessageEmbed()
        .setTitle(`**${message.guild.name} Auto Lines**`)
        .setThumbnail(message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter(message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setColor(color)
        .setAuthor(message.guild.name, message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setDescription(list.join("\n\n"))
      message.channel.send(embed)
    }
  }
})

client.on('message', async msg => {
  if (msg.channel.type === 'dm') return;
  let li = db.get(`line_${msg.guild.id}`)
  if (li) {
    if (msg.author.id === client.user.id) return
    const chn = li.find(x => x.channel === msg.channel.id)
    if (chn) msg.channel.send({ files: [chn.line] })
  }
})

client.on('message', async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "chatadd")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let channel = message.mentions.channels.first()
    if (!channel) return message.reply("**❌ Error Please Mention The Channel**")
    let database = db.get(`chat_${message.guild.id}`)
    if (database && database.find(x => x.channel === channel.id)) return message.channel.send(`**❌ Error This Channel ${channel} Has Been Added Before**`)
    message.channel.send(`**✅ Done The Chat Bot Has Been Added To ${channel}**`);
    let data = {
      channel: channel.id
    }
    db.push(`chat_${message.guild.id}`, data)
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "chatremove")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let first = message.mentions.channels.first()
    if (!first) return message.reply("**❌ Error Please Mention The Channel**")
    let database = db.get(`chat_${message.guild.id}`)
    if (database) {
      let data = database.find(x => x.channel === first.id)
      if (!data) return message.reply("**❌ Error Invalid Channel**")
      let value = database.indexOf(data)
      delete database[value]

      var filter = database.filter(x => {
        return x != null && x != ''
      })
      db.set(`chat_${message.guild.id}`, filter)
      message.channel.send("**✅ Done The Chat Bot Has Been Removed**")
    } else {
      message.reply("**❌ Error Invalid Channel**")
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.content.startsWith(prefix + "chatlist")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let database = db.get(`chat_${message.guild.id}`)
    if (!database) return message.reply("**❌ Error There is No Chat Bot In This Server**")
    let list = []
    if (database && database.length) {
      database.forEach(x => {
        list.push(`**Channel : <#${x.channel}>**
`)
      })
      if (list.length === 0) return message.reply("**❌ Error There is No Chat Bot In This Server**")
      let embed = new Discord.MessageEmbed()
        .setTitle(`**${message.guild.name} Chat Bots**`)
        .setThumbnail(message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter(message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setColor(color)
        .setAuthor(message.guild.name, message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setDescription(list.join("\n\n"))
      message.channel.send(embed)
    }
  }
})

const cleverbot = require("cleverbot-free");
client.on('message', async msg => {
  if (msg.channel.type === 'dm') return;
  let li = db.get(`chat_${msg.guild.id}`)
  if (li) {
    if (msg.author.bot) return
    const chn = li.find(x => x.channel === msg.channel.id)
    if (chn) {
      cleverbot(msg.content).then(response => {
        msg.reply(response)
      })
    }
  }
})

client.on('message', async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "deleteadd")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let channel = message.mentions.channels.first()
    if (!channel) return message.reply("**❌ Error Please Mention The Channel**")
    let time = message.content.split(' ').slice(2)
    if (!time[0]) return message.reply("**❌ Error Please Put The Time**")
    let database = db.get(`delete_${message.guild.id}`)
    if (database && database.find(x => x.channel === channel.id)) return message.channel.send(`**❌ Error This Channel ${channel} Has Been Added Before**`)
    message.channel.send(`**✅ Done The Auto Delete Has Been Added To ${channel} With Time \`${time[0]}\`**`);
    let data = {
      channel: channel.id,
      time: time[0]
    }
    db.push(`delete_${message.guild.id}`, data)
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "deleteremove")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let first = message.mentions.channels.first()
    if (!first) return message.reply("**❌ Error Please Mention The Channel**")
    let database = db.get(`delete_${message.guild.id}`)
    if (database) {
      let data = database.find(x => x.channel === first.id)
      if (!data) return message.reply("**❌ Error Invalid Channel**");
      let value = database.indexOf(data)
      delete database[value]

      var filter = database.filter(x => {
        return x != null && x != ''
      })
      db.set(`delete_${message.guild.id}`, filter)
      message.channel.send("**✅ Done The Auto Delete Has Been Removed**")
    } else {
      message.reply("**❌ Error Invalid Channel**")
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.content.startsWith(prefix + "deletelist")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let database = db.get(`delete_${message.guild.id}`)
    if (!database) return message.reply("**❌ Error There is No Auto Delete In This Server**")
    let list = []
    if (database && database.length) {
      database.forEach(x => {
        list.push(`**Channel : <#${x.channel}>**
> Time : ${x.time}
`)
      })
      if (list.length === 0) return message.reply("**❌ Error There is No Auto Delete In This Server**")
      let embed = new Discord.MessageEmbed()
        .setTitle(`**${message.guild.name} Auto Deletes**`)
        .setThumbnail(message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter(message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setColor(color)
        .setAuthor(message.guild.name, message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setDescription(list.join("\n\n"))
      message.channel.send(embed)
    }
  }
})

client.on('message', async msg => {
  if (msg.channel.type === 'dm') return;
  let li = db.get(`delete_${msg.guild.id}`)
  if (li) {
    const chn = li.find(x => x.channel === msg.channel.id)
    if (chn) msg.delete({ timeout: ms(chn.time) })
  }
})

client.on('message', async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "stickyadd")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let channel = message.mentions.channels.first()
    if (!channel) return message.reply("**❌ Error Please Mention The Channel**")
    let msgs = message.content.split(' ').slice(2).join(' ')
    if (!msgs) return message.reply("**❌ Error Please Put The Message**")
    let database = db.get(`sticky_${message.guild.id}`)
    if (database && database.find(x => x.channel === channel.id)) return message.channel.send(`**❌ Error This Channel ${channel} Has Been Added Before**`)
    message.channel.send(`**✅ Done The Sticky Channel Has Been Added To ${channel}**`);
    let data = {
      channel: channel.id,
      msgs: msgs
    }
    db.push(`sticky_${message.guild.id}`, data)
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "stickyremove")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let first = message.mentions.channels.first()
    if (!first) return message.reply("**❌ Error Please Mention The Channel**")
    let database = db.get(`sticky_${message.guild.id}`)
    if (database) {
      let data = database.find(x => x.channel === first.id)
      if (!data) return message.reply("**❌ Error Invalid Channel**")
      let value = database.indexOf(data)
      delete database[value]

      var filter = database.filter(x => {
        return x != null && x != ''
      })
      db.set(`sticky_${message.guild.id}`, filter)
      message.channel.send("**✅ Done The Sticky Channel Has Been Removed**")
    } else {
      message.reply("**❌ Error Invalid Channel**")
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;
  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.content.startsWith(prefix + "stickylist")) {
    if (!message.member.hasPermission("MANAGE_GUILD")) return
    let database = db.get(`sticky_${message.guild.id}`)
    if (!database) return message.reply("**❌ Error There is No Sticky In This Server**")
    let list = []
    if (database && database.length) {
      database.forEach(x => {
        list.push(`**Channel : <#${x.channel}>**
> Message : ${x.msgs}
`)
      })
      if (list.length === 0) return message.reply("**❌ Error There is No Sticky In This Server**")
      let embed = new Discord.MessageEmbed()
        .setTitle(`**${message.guild.name} Stickys**`)
        .setThumbnail(message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter(message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setColor(color)
        .setAuthor(message.guild.name, message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setDescription(list.join("\n\n"))
      message.channel.send(embed)
    }
  }
})

client.on('message', async message => {
  if (message.channel.type === 'dm') return;
  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  let sug = db.get(`sticky_${message.guild.id}`)
  if (sug) {
    const chn = sug.find(x => x.channel === message.channel.id)
    if (chn) {
      let oldEmbed = message.embeds[0];
      if (oldEmbed) {
        if (oldEmbed.description === chn.msgs) return;
      }

      const data = await stickyTempModel.findOne({
        ChannelID: message.channel.id
      });
      if (data) {
        const lastStickyID = data.lastStickyID;
        await stickyTempModel.findOneAndRemove({
          ChannelID: message.channel.id
        });
        try {
          let last = await message.channel.messages.fetch(
            lastStickyID,
            false,
            true
          );
          last.delete();
        } catch (error) {
          console.error(error);
        }
      }

      let stickyEmbed = new Discord.MessageEmbed()
        .setDescription(chn.msgs)
        .setColor(color);

      let sent = await message.channel.send(stickyEmbed);

      let newData = new stickyTempModel({
        lastStickyID: sent.id,
        ChannelID: message.channel.id,
        GuildID: message.guild.id
      });
      let test = await stickyTempModel.findOne({
        ChannelID: message.channel.id
      });

      if (!test) {
        newData.save();
      } else {
        sent.delete();
      }
    }
  }
})

client.on('message', async message => {
  const code = require("@codedipper/random-code");
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`)
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "autoadd")) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return
    var filter = m1 => m1.author.id === message.author.id;

    var username = message.author.id;

    var js1;

    message.channel.send(`**Type The Word**`).then(message => {

      message.channel.awaitMessages(filter, {
        max: 1,
        time: 90000,
        errors: ['time'],
      })

        .then(collected => {

          collected.first().delete();

          js1 = collected.first().content;

          const database = db.get(`reply_${message.guild.id}`)
          if (database && database.find(x => x.word === js1)) return message.channel.send(`**❌ Error This Word \`${js1}\` Has Been Added Before**`)

          var js2;

          message.edit(`**Type The Response**`).then(message => {

            message.channel.awaitMessages(filter, {
              max: 1,
              time: 90000,
              errors: ['time'],
            })

              .then(collected => {

                collected.first().delete();

                js2 = collected.first().content;



                var js3;

                message.edit(`**Are You Sure You Want Create Auto Response? ( Yes | No )**`)


                message.channel.awaitMessages(response => response.content.toLowerCase() === 'no' || 'yes' && filter, {

                  max: 1,

                  time: 90000,

                  errors: ['time']

                })

                  .then(collected => {

                    if (collected.first().content.toLowerCase() === 'no') {

                      message.delete();

                      message.delete();



                    }

                    if (collected.first().content.toLowerCase() === 'yes') {

                      message.edit(`**✅ Done The Auto Response Has Been Added**`);
                      collected.first().delete();
                      const id = code(10)
                      let data = {
                        word: js1,
                        respone: js2,
                        id: id.toLowerCase()
                      }
                      db.push(`reply_${message.guild.id}`, data)
                    }
                  })
              })
          })

        })
    })
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`)
  if (prefix === null) prefix = pp;
  if (message.content.startsWith(prefix + "autoremove")) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return
    let args = message.content.split(' ').slice(1)
    let first = args[0]
    if (!first) return message.reply("**❌ Error Please Put The ID**")
    let database = db.get(`reply_${message.guild.id}`)
    if (database) {
      let data = database.find(x => x.id === first.toLowerCase())
      if (!data) return message.reply("**❌ Error Invalid ID**")
      let value = database.indexOf(data)
      delete database[value]

      var filter = database.filter(x => {
        return x != null && x != ''
      })
      db.set(`reply_${message.guild.id}`, filter)
      message.channel.send("**✅ Done The Auto Response Has Been Removed**")
    } else {
      message.reply("**❌ Error Invalid ID**")
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`)
  if (prefix === null) prefix = pp;
  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.content.startsWith(prefix + "autolist")) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return
    let database = db.get(`reply_${message.guild.id}`)
    if (!database) return message.channel.send("**❌ Error There is No Auto Responses In This Server**")
    let list = []
    if (database && database.length) {
      database.forEach(x => {
        list.push(`**Word : ${x.word}**
> Response : ${x.respone}
> ID : ${x.id}
`)
      })
      if (list.length === 0) return message.channel.send("**❌ Error There is No Auto Responses In This Server**")

      let embed = new Discord.MessageEmbed()
        .setTitle(`**${message.guild.name} Auto Responses**`)
        .setThumbnail(message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter(message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setColor(color)
        .setAuthor(message.guild.name, message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setDescription(list.join("\n\n"))
      message.channel.send(embed)
    }
  }
})

client.on('message', async message => {
  if (message.channel.type === 'dm') return;
  if (message.author.bot) return
  let reply = db.get(`reply_${message.guild.id}`)
  if (message.author.bot) return
  if (reply) {
    let customcommand = reply.find(x => x.word === message.content)
    if (customcommand) {
      message.guild.fetchInvites().then(invites => {
        let personalInvites = invites.filter(
          i =>
            i.inviter.id === message.author.id
        );

        let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);

        message.guild.fetchInvites().then(invites => {
          let personalInvites = invites.filter(i => i.inviter.id === message.author.id);
          let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
          message.channel.send(customcommand.respone.replace(/\[user]/g, `<@${message.author.id}>`).replace(/\[userName]/g, `${message.author.username}`).replace(/\[userTag]/g, `${message.author.discriminator}`).replace(/\[userString]/g, `${message.author.tag}`).replace(/\[userInvites]/g, `${inviteCount}`))
        })
      })
    }
  }
})

/*Server Info*/

/*
client.on("message", message => {
  if(message.content === (prefix + "sinfo")) {
    let embed = new Discord.MessageEmbed()
    .setTitle("**Official social media**")
    .setDescription(`**حسابات بندريتا الرسمية على مواقع التواصل الاجتماعي**\n_ _`)
    .addFields({
      name: `**<:YouTube_BNX:852950220131663984> | YouTube**`,
      value: `**[BanderitaX]( https://www.youtube.com/c/BanderitaX )**\n_ _`,
      inline: false
    }, {
      name: `**<:Twitch_BNX:852950441091268649> | Twitch**`,
      value: `**[BanderitaX]( https://www.twitch.tv/banderitax )**\n_ _`,
      inline: false
    }, {
      name: `**<:Instagram_BNX:852951059751239700> | Instagram**`,
      value: `**[banderita_x]( https://www.instagram.com/banderita_x/ )**\n_ _`,
      inline: false
    }, {
      name: `**<:Twitter_BNX:852951306187833435> | Twitter**`,
      value: `**[@BanderitaX]( https://twitter.com/BanderitaX )**\n_ _`,
      inline: false
    }, {
      name: `**<:Snapchat_BNX:852951742932189246> | Snapchat**`,
      value: `**[BanderitaX]( https://www.snapchat.com/add/BanderitaX )**\n_ _`,
      inline: false
    }, {
      name: `**<:TikTok_BNX:852952351815368734> | TikTok**`,
      value: `**[@banderitax]( https://www.tiktok.com/@banderitax )**\n_ _`,
      inline: false
    }, {
      name: `**<:Reddit_BNX:852952601191514138> | Reddit**`,
      value: `**[r/BanderitaX]( https://www.reddit.com/r/BanderitaX/ )**\n_ _`,
      inline: false
    }, {
      name: `**<:Discord_BNX:852952730581860382> | Discord**`,
      value: `**[BanderitaX]( https://discord.gg/Banderitax )**\n_ _`,
      inline: false
    }, {
      name: `**<a:YouTubeJ_BNX:852953034766286859> | YouTube Join**`,
      value: `**[Click here]( https://www.youtube.com/channel/UCxEGVXh6fi-XYo58NZrbIHQ/join )**\n_ _`,
      inline: true
    }, {
      name: `**<a:TwitchS_BNX:852953061127356436> | Twitch Subscribe**`,
      value: `**[Click here]( https://www.twitch.tv/products/banderitax )**\n_ _`,
      inline: true
    }, {
      name: `**<a:Donate_BNX:852953543409008691> | Donate**`,
      value: `**[Click here]( https://streamlabs.com/banderitax1/tip )**\n`,
      inline: true
    })
    .setThumbnail("https://cdn.discordapp.com/attachments/820974861064470608/852962070491037746/BanderitaX_DiscordLogo_GIF03_logo.gif")
    .setImage("https://cdn.discordapp.com/attachments/820974861064470608/852962117175083019/2021-06-04_19-31-43_10.gif")
    .setColor(color)
    message.channel.send(embed)
  }
})
*/
/*
client.on("message", message => {
  if(message.content === prefix + "procedures") {
    let embed = new Discord.MessageEmbed()
    .setTitle("الأجرائات")
    .setDescription(`المخالفات والعقوبات:

اولاََ  قَالَ رَسُولُ اللَّهِ ﷺ: كُلُّ بَنِي آدَمَ خَطَّاءٌ، وخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ.
في حالة اعتذار الشخص, وتعلمه من خطائه يتم تخفيف العقوبة للحد الادنى.`)
    .addField("-",` \`السب\`
- اول مره تحذير مع ميوت 3 ساعات - المره الثانية تحذير مع ميوت 48 ساعة -  المره الثالث باند نهائي.

\`القذف\`
- باند مؤبد. في حالة اعتذار الشخص من صاحب الشكوى ومسامحته يمكن رفع الباند.

 \`النشر بدون موافقة الاشخاص وازعاجهم\` 
- الطرد من الخادم للمره الاولى. والمره الثانية باند.

  \`التكلم بالمواضيع السياسية او الدينية او العنصرية\` 
  - المره الاولى تحذير مع ميوت 30 دقيقة  -  المره الثانية تحذير ثاني وميوت يوم كامل - المره الاخيرة باند مؤبد.
  \`التحدث بالمواضيع الغير اخلاقية\` 
 - باند مؤبد.
 \`مضايقة الاعضاء والتنمر\`
- المره الاولى انذار مع ميوت لمدة يوم - المره الثانية باند لمدة 14 يوم - المره الثالثة باند مؤبد

\`طلب رتب ادارية بازعاج\`
- المره الاولى تحذير وميوت 5 دقائق  -  المره الثانية تحذير وميوت 6 ساعة 
-  المره الثالثة تحذير وميوت 7 ايام .
`)
    .addField("-",` \`سبام مزعج&سبام عادي\`
المزعج: اول مره تحذير مع ميوت ساعتين  -  ثاني مره تحذير مع ميوت 7  يوم  -  ثالث مره باند مؤبد.
العادي: ميوت 5 دقايق اول مره - ثاني نص ساعة - وكل مره زيد نص ساعة.
\`الازعاج فالرومات الصوتية\`
- المره الاولى تحذير مع ميوت20 دقيقة  -  المره الثانيةتحذير مع ميوت 3 ساعات  -  المره الثالثة تحذير مع ميوت  3 ايام.
\`انتحال الشخصيات العامة والمشهورة\`
- في حالة كان تقليد من فانز ومو انتحال تحذير وتنبيه اما اذا منتحل يدعي انه نفس الشخصية باند مؤبد.
\`طلب الاموال او نيترو من الناس\`
- اول مره تحذير مع ميوت 15 دقيقة  -  ثاني مره تحذير مع ميوت ساعة  -  ثالث مره تحذير مع ميوت 12 ساعة.
\`الكتابة في الرومات غير المخصص لها\`
- تحذير للشخص مع حذف الرسائل.
\`فتح تكت بدون سبب\`
- كل مره يفتح بدون سبب ياخذ تحذير واذا وصل 7 باند.

\`حرق احداث الافلام او الانمي\`
- تحذير الشخص مع ميوت يوم للمرة الاولى - المرة ثانية 7 ايام - الثالثة باند
`)
    .addField("-",`ملاحظات:

عقوبات السب تنطبق على الاشخاص الي يسبون الاداريين كمان لكن في حالة السب القوي باند مباشرة.

" العقوبات قابلة للتحديث و الاضافة ومن المهم مراجعتها و الالتزام بها و عند مخالفتك او تكرار ما يمنع فيها سيتم ازالة الرتبة منك"
`)
    .setColor(color)
    .setThumbnail(message.guild.iconURL({
    format: "png",
    size: 4096,
    dynamic: true
}))
    .setImage("https://media.discordapp.net/attachments/820974861064470608/852962117175083019/2021-06-04_19-31-43_10.gif")
    .setFooter(message.guild.name,message.guild.iconURL({
    format: "png",
    size: 4096,
    dynamic: true
}))
    .setTimestamp()
    message.channel.send(embed)
  }
})
*/
/*Server Info*/

client.on("message", async message => {
  if (message.channel.type === "dm") return
  if (message.content.toLowerCase().startsWith(prefix + "eval")) {
    if (message.content.includes("token")) return
    if (message.author.id === "708836279399350332") {
      const embed = new Discord.MessageEmbed()
      const c = message.channel
      if (message.author.id === client.user.id) return
      const args = message.content.split(' ').slice(1)
      const code = args.join(' ')
      if (!code) return c.send(`**❌ Error Please Put The Code To Evaluate**`)
      try {
        const result = eval(code.replace(`${prefix}eval`, ''))
        let output = result
        c.send(output)
      } catch (error) {
        c.send(`**❌ Error\`\`\`js\n${error}\n\`\`\`**`)
      }
    }
  }
})

client.on('message', async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === 'large') {
    let argst = message.content.split(' ').slice(1)
    const emoji = argst[0];
    if (!emoji) return message.reply(`**❌ Error Please Put The Emoji**`);

    let custom = Discord.Util.parseEmoji(emoji);
    const embed = new Discord.MessageEmbed()
      .setAuthor(
        message.guild.name,
        message.guild.iconURL({
          format: 'png',
          size: 4096,
          dynamic: true
        })
      )
      .setFooter(
        message.author.tag,
        message.author.avatarURL({
          format: 'png',
          size: 4096,
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor(color)
      .setTitle(`Emoji Link`)
      .setURL(
        `https://cdn.discordapp.com/emojis/${custom.id}.${
        custom.animated ? 'gif' : 'png'
        }`
      );
    if (custom.id) {
      embed.setImage(
        `https://cdn.discordapp.com/emojis/${custom.id}.${
        custom.animated ? 'gif' : 'png'
        }`
      );
      return message.channel.send(embed);
    } else {
      let parsed = parse(emoji, { assetType: 'png' });
      if (!parsed[0]) return message.reply('**❌ Error Invalid Emoji**');

      embed.setImage(parsed[0].url);
      return message.channel.send(embed);
    }
  }
});

client.on("message", message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === "banner") {
    try {
      let embed = new Discord.MessageEmbed()
        .setTitle("Banner URL")
        .setURL(message.guild.bannerURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setColor(color)
        .setAuthor(message.guild.name, message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter("Requested By : " + message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setImage(message.guild.bannerURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
      message.channel.send(embed)

    } catch (error) {
      console.error(error)
    }
  }
})

client.on("message", message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === "splash") {
    try {
      let embed = new Discord.MessageEmbed()
        .setTitle("Splash URL")
        .setURL(message.guild.splashURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setColor(color)
        .setAuthor(message.guild.name, message.guild.iconURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setFooter("Requested By : " + message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setImage(message.guild.splashURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
      message.channel.send(embed)

    } catch (error) {
      console.error(error)
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.channel.id === "838128771490906122") {

    let oldEmbed = message.embeds[0];
    if (oldEmbed) {
      if (oldEmbed.description === `**عندك قصه حلوه تحكيها لبندر؟
جيت للمكان المناسب

يرجى  كتابة القصة بصيغة مفهومة وبدون اخطاء املائية او قد تتعرض قصتك للحذف كما ان الاستهزاء قد يعرضك للحظر من السيرفر.**`) return;
    }

    const data = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });
    if (data) {
      const lastStickyID = data.lastStickyID;
      await stickyTempModel.findOneAndRemove({
        ChannelID: message.channel.id
      });
      try {
        let last = await message.channel.messages.fetch(
          lastStickyID,
          false,
          true
        );
        last.delete();
      } catch (error) {
        console.error(error);
      }
    }

    let stickyEmbed = new Discord.MessageEmbed()
      .setDescription(`**عندك قصه حلوه تحكيها لبندر؟
جيت للمكان المناسب

يرجى  كتابة القصة بصيغة مفهومة وبدون اخطاء املائية او قد تتعرض قصتك للحذف كما ان الاستهزاء قد يعرضك للحظر من السيرفر.**`)
      .setTitle("**__قصص المتابعين__**")
      .setThumbnail(message.guild.iconURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setColor(color);

    let sent = await message.channel.send(stickyEmbed);

    let newData = new stickyTempModel({
      lastStickyID: sent.id,
      ChannelID: message.channel.id,
      GuildID: message.guild.id
    });
    let test = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });

    if (!test) {
      newData.save();
    } else {
      sent.delete();
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.channel.id === "838930490873348106") {

    let oldEmbed = message.embeds[0];
    if (oldEmbed) {
      if (oldEmbed.description === `**روم الرسامين**

> روم مخصص لعرض ابداعات فنانين السيرفر
> 
> اذا كانت لديك اعمال خاصة بك تريد نشرها يرجى التقديم لرتبة
> <@&838658732782911530>
> اولاََ [بالضغط هنا]( https://discord.com/channels/690961823121408022/752875382977462303/836083962698793000 ) والتواصل مع [ [الدعم الفني]( https://discord.com/channels/690961823121408022/752875382977462303/836083962698793000 ) ]`) return;
    }

    const data = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });
    if (data) {
      const lastStickyID = data.lastStickyID;
      await stickyTempModel.findOneAndRemove({
        ChannelID: message.channel.id
      });
      try {
        let last = await message.channel.messages.fetch(
          lastStickyID,
          false,
          true
        );
        last.delete();
      } catch (error) {
        console.error(error);
      }
    }

    let stickyEmbed = new Discord.MessageEmbed()
      .setDescription(`**روم الرسامين**

> روم مخصص لعرض ابداعات فنانين السيرفر
> 
> اذا كانت لديك اعمال خاصة بك تريد نشرها يرجى التقديم لرتبة
> <@&838658732782911530>
> اولاََ [بالضغط هنا]( https://discord.com/channels/690961823121408022/752875382977462303/836083962698793000 ) والتواصل مع [ [الدعم الفني]( https://discord.com/channels/690961823121408022/752875382977462303/836083962698793000 ) ]`)
      .setColor(color);

    let sent = await message.channel.send(stickyEmbed);

    let newData = new stickyTempModel({
      lastStickyID: sent.id,
      ChannelID: message.channel.id,
      GuildID: message.guild.id
    });
    let test = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });

    if (!test) {
      newData.save();
    } else {
      sent.delete();
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.channel.id === "838844594313232406") {

    let oldEmbed = message.embeds[0];
    if (oldEmbed) {
      if (oldEmbed.description === `**ميمز الريديت :**

> روم مخصص لنشر الميمز من الريدت في حالة رغبتك في المشاركة يرجى مشاركة الميم الخاص بك عبر الرابط التالي :
> https://www.reddit.com/r/BanderitaX/


\*يرجى الالتزام بقوانين الريدت\*`) return;
    }

    const data = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });
    if (data) {
      const lastStickyID = data.lastStickyID;
      await stickyTempModel.findOneAndRemove({
        ChannelID: message.channel.id
      });
      try {
        let last = await message.channel.messages.fetch(
          lastStickyID,
          false,
          true
        );
        last.delete();
      } catch (error) {
        console.error(error);
      }
    }

    let stickyEmbed = new Discord.MessageEmbed()
      .setDescription(`**ميمز الريديت :**

> روم مخصص لنشر الميمز من الريدت في حالة رغبتك في المشاركة يرجى مشاركة الميم الخاص بك عبر الرابط التالي :
> https://www.reddit.com/r/BanderitaX/


\*يرجى الالتزام بقوانين الريدت\*`)
      .setColor(color);

    let sent = await message.channel.send(stickyEmbed);

    let newData = new stickyTempModel({
      lastStickyID: sent.id,
      ChannelID: message.channel.id,
      GuildID: message.guild.id
    });
    let test = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });

    if (!test) {
      newData.save();
    } else {
      sent.delete();
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.channel.id === "837737324854902845") {

    let oldEmbed = message.embeds[0];
    if (oldEmbed) {
      if (oldEmbed.description === `**عندك مرحلة من تصميمك او مرحلة تنصح بندريتا يلعبها؟
شاركنا المرحلة هنا, مخالفة قوانين الروم او مشاركة شي لا تصله صلة بالروم قد يعرضك للعقوبات او حذف مشاركتك.**`) return;
    }

    const data = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });
    if (data) {
      const lastStickyID = data.lastStickyID;
      await stickyTempModel.findOneAndRemove({
        ChannelID: message.channel.id
      });
      try {
        let last = await message.channel.messages.fetch(
          lastStickyID,
          false,
          true
        );
        last.delete();
      } catch (error) {
        console.error(error);
      }
    }

    let stickyEmbed = new Discord.MessageEmbed()
      .setTitle(`**__مراحل ماريو ميكر__**`)
      .setDescription(`**عندك مرحلة من تصميمك او مرحلة تنصح بندريتا يلعبها؟
شاركنا المرحلة هنا, مخالفة قوانين الروم او مشاركة شي لا تصله صلة بالروم قد يعرضك للعقوبات او حذف مشاركتك.**`)
      .setThumbnail(message.guild.iconURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setColor(color);

    let sent = await message.channel.send(stickyEmbed);

    let newData = new stickyTempModel({
      lastStickyID: sent.id,
      ChannelID: message.channel.id,
      GuildID: message.guild.id
    });
    let test = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });

    if (!test) {
      newData.save();
    } else {
      sent.delete();
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.channel.id === "852182609169219624") {

    let oldEmbed = message.embeds[0];
    if (oldEmbed) {
      if (oldEmbed.description === `> **عندك اقتراح لفكرة مقطع؟ اكتب فكرتك هنا بتفصيل وبندر يقلك شكراََ مره**

> **ملاحظة: يرجى ارسال اقتراحات للقناة فقط وعدم نشر اقتراحات للسيرفر الخ**`) return;
    }

    const data = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });
    if (data) {
      const lastStickyID = data.lastStickyID;
      await stickyTempModel.findOneAndRemove({
        ChannelID: message.channel.id
      });
      try {
        let last = await message.channel.messages.fetch(
          lastStickyID,
          false,
          true
        );
        last.delete();
      } catch (error) {
        console.error(error);
      }
    }

    let stickyEmbed = new Discord.MessageEmbed()
      .setTitle(`**__اقتراحات للقناة__**`)
      .setDescription(`> **عندك اقتراح لفكرة مقطع؟ اكتب فكرتك هنا بتفصيل وبندر يقلك شكراََ مره**

> **ملاحظة: يرجى ارسال اقتراحات للقناة فقط وعدم نشر اقتراحات للسيرفر الخ**`)
      .setThumbnail(message.guild.iconURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setColor(color);

    let sent = await message.channel.send(stickyEmbed);

    let newData = new stickyTempModel({
      lastStickyID: sent.id,
      ChannelID: message.channel.id,
      GuildID: message.guild.id
    });
    let test = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });

    if (!test) {
      newData.save();
    } else {
      sent.delete();
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.channel.id === "854753679684665364") {

    let oldEmbed = message.embeds[0];
    if (oldEmbed) {
      if (oldEmbed.description === `> **اقترح لنا لقطة من مقاطع بندر بشرط تكون قيم بلي.**
> **كيف تقترح؟**
> **حط الرابط وسوي منشن للدقيقة الي تبدا فيها اللقطة**`) return;
    }

    const data = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });
    if (data) {
      const lastStickyID = data.lastStickyID;
      await stickyTempModel.findOneAndRemove({
        ChannelID: message.channel.id
      });
      try {
        let last = await message.channel.messages.fetch(
          lastStickyID,
          false,
          true
        );
        last.delete();
      } catch (error) {
        console.error(error);
      }
    }

    let stickyEmbed = new Discord.MessageEmbed()
      .setDescription(`> **اقترح لنا لقطة من مقاطع بندر بشرط تكون قيم بلي.**
> **كيف تقترح؟**
> **حط الرابط وسوي منشن للدقيقة الي تبدا فيها اللقطة**`)
      .setTitle("**__افضل لقطة__**")
      .setThumbnail(message.guild.iconURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setColor(color);

    let sent = await message.channel.send(stickyEmbed);

    let newData = new stickyTempModel({
      lastStickyID: sent.id,
      ChannelID: message.channel.id,
      GuildID: message.guild.id
    });
    let test = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });

    if (!test) {
      newData.save();
    } else {
      sent.delete();
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.channel.id === "857677455980494873") {

    let oldEmbed = message.embeds[0];
    if (oldEmbed) {
      if (oldEmbed.description === `> **عندك ايدت سويته لبندريتا؟ شاركنا ابداعك هنا, تبي تشارك مقطع مو لك؟ عادي لكن نتمنى منك ذكر حقوق المالك اقل شي ولا تنسبه لنفسك**`) return;
    }

    const data = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });
    if (data) {
      const lastStickyID = data.lastStickyID;
      await stickyTempModel.findOneAndRemove({
        ChannelID: message.channel.id
      });
      try {
        let last = await message.channel.messages.fetch(
          lastStickyID,
          false,
          true
        );
        last.delete();
      } catch (error) {
        console.error(error);
      }
    }

    let stickyEmbed = new Discord.MessageEmbed()
      .setDescription(`> **عندك ايدت سويته لبندريتا؟ شاركنا ابداعك هنا, تبي تشارك مقطع مو لك؟ عادي لكن نتمنى منك ذكر حقوق المالك اقل شي ولا تنسبه لنفسك**`)
      .setTitle("**__ايدت بندريتا__**")
      .setThumbnail(message.guild.iconURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setColor(color);

    let sent = await message.channel.send(stickyEmbed);

    let newData = new stickyTempModel({
      lastStickyID: sent.id,
      ChannelID: message.channel.id,
      GuildID: message.guild.id
    });
    let test = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });

    if (!test) {
      newData.save();
    } else {
      sent.delete();
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.channel.id === "859949145129484328") {

    let oldEmbed = message.embeds[0];
    if (oldEmbed) {
      if (oldEmbed.description === `**هنا بأمكانك تقديم طلبك للانضمام لكلان يرجى ذكر الأتي:
الاسم:
العمر:
المايك:
الكلان:

بعد ذلك سيتواصل معك احد مشرفين الكلان الذي ترغب بالانضمام اليه.

يرجىء مراعاة الاستخدام الصحيح لهذا الروم.**`) return;
    }

    const data = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });
    if (data) {
      const lastStickyID = data.lastStickyID;
      await stickyTempModel.findOneAndRemove({
        ChannelID: message.channel.id
      });
      try {
        let last = await message.channel.messages.fetch(
          lastStickyID,
          false,
          true
        );
        last.delete();
      } catch (error) {
        console.error(error);
      }
    }

    let stickyEmbed = new Discord.MessageEmbed()
      .setDescription(`**هنا بأمكانك تقديم طلبك للانضمام لكلان يرجى ذكر الأتي:
الاسم:
العمر:
المايك:
الكلان:

بعد ذلك سيتواصل معك احد مشرفين الكلان الذي ترغب بالانضمام اليه.

يرجىء مراعاة الاستخدام الصحيح لهذا الروم.**`)
      .setTitle("**__التقديم لكلان__**")
      .setThumbnail(message.guild.iconURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setColor(color);

    let sent = await message.channel.send(stickyEmbed);

    let newData = new stickyTempModel({
      lastStickyID: sent.id,
      ChannelID: message.channel.id,
      GuildID: message.guild.id
    });
    let test = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });

    if (!test) {
      newData.save();
    } else {
      sent.delete();
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  var prefix = db.get(`po_${message.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${message.guild.id}`);
  if (color === null) color = cc;
  if (message.channel.id === "866556565312765952") {

    let oldEmbed = message.embeds[0];
    if (oldEmbed) {
      if (oldEmbed.description === `> **عندك نكتة تقولها لبندر؟**
> **اكتبها هنا وتأكد من عدم وجود هاذي الاشياء فالنكتة**

> **العنصرية - استهزاء بالدين - الفاظ غير مناسبة**

> **يرجى مراعاة قوانين الروم واستخدامه الصحيح او قد تتعرض للعقوبات او حذف رسالتك**`) return;
    }

    const data = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });
    if (data) {
      const lastStickyID = data.lastStickyID;
      await stickyTempModel.findOneAndRemove({
        ChannelID: message.channel.id
      });
      try {
        let last = await message.channel.messages.fetch(
          lastStickyID,
          false,
          true
        );
        last.delete();
      } catch (error) {
        console.error(error);
      }
    }

    let stickyEmbed = new Discord.MessageEmbed()
      .setDescription(`> **عندك نكتة تقولها لبندر؟**
> **اكتبها هنا وتأكد من عدم وجود هاذي الاشياء فالنكتة**

> **العنصرية - استهزاء بالدين - الفاظ غير مناسبة**

> **يرجى مراعاة قوانين الروم واستخدامه الصحيح او قد تتعرض للعقوبات او حذف رسالتك**`)
      .setTitle("**__نكت المتابعين__**")
      .setThumbnail(message.guild.iconURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setColor(color);

    let sent = await message.channel.send(stickyEmbed);

    let newData = new stickyTempModel({
      lastStickyID: sent.id,
      ChannelID: message.channel.id,
      GuildID: message.guild.id
    });
    let test = await stickyTempModel.findOne({
      ChannelID: message.channel.id
    });

    if (!test) {
      newData.save();
    } else {
      sent.delete();
    }
  }
})

client.on("message", async message => {
  if (message.channel.type === "dm") return
  if (message.channel.id === "857677455980494873") {
    if (message.author.bot) return
    if (!message.attachments.first()) return message.delete()
    message.react('<:Like_BNX:857678552840536065>').then(() => {
      message.channel.send({
        files: [line]
      })
    })
  }
})

client.on("message", message => {
  if (message.channel.id === "854753679684665364") {
    if (message.author.bot) return
    if (message.content.includes("youtu.be/") || message.content.includes("youtube.com/watch")) {
      message.channel.send({ files: [line] })
      return
    }
    message.delete()
  }
})


client.on("message", async msg => {
  if (msg.channel.type === "dm") return
  var prefix = db.get(`po_${msg.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${msg.guild.id}`);
  if (color === null) color = cc;
  if (msg.channel.id === "838128771490906122") {
    if (msg.author.bot) return
    if (msg.content.includes("https://") || msg.content.includes("discord.gg/") || msg.content.includes("ضرطاتي") || msg.content.includes("طقعة") || msg.content.includes("طقعه") || msg.content.includes("زق") || msg.content.includes("زقيت") || msg.content.includes("طقعت") || msg.content.includes("طقعتي") || msg.content.includes("طقوعه") || msg.content.includes("طقوعة") || msg.content.includes("خرا") || msg.content.includes("طقع") || msg.content.includes("طقعو") || msg.content.includes("طقعات") || msg.content.includes("ابول") || msg.content.includes("بول") || msg.content.includes("شخيت") || msg.content.includes("شخة") || msg.content.includes("شخه") || msg.content.includes("زقة") || msg.content.includes("زقه") || msg.content.includes("ز.") || msg.content.includes("اطكع") || msg.content.includes("طكعة") || msg.content.includes("طكعت") || msg.content.includes("ضرطه") || msg.content.includes("ضرطة") || msg.content.includes("ضرطت") || msg.content.includes("ضرطات") || msg.content.includes("ضرطتي") || msg.content.includes("ضروطة") || msg.content.includes("💩") || msg.content.includes(":poop:") || msg.content.includes("جرس") || msg.content.includes("متابعين") || msg.content.includes("تابعني") || msg.content.includes("قناتي") || msg.content.includes("كورونا") || msg.content.includes("فيديو") || msg.content.includes("مقطع") || msg.content.includes("ابوفله") || msg.content.includes("ابوفلة") || msg.content.includes("ابو فله") || msg.content.includes("ابو فلة") || msg.content.includes("بالروضة") || msg.content.includes("الروضة") || msg.content.includes("الابتدائية") || msg.content.includes("العن") || msg.content.includes("يلعن") || msg.content.includes("تبن") || msg.content.includes("حسران") || msg.content.includes("حشران") || msg.content.includes("متوسط") || msg.content.includes("بندرتينة") || msg.content.includes("بندرتينا") || msg.content.includes("محتواك") || msg.content.includes("قناتك") || msg.content.includes(":peach:") || msg.content.includes(":eggplant:") || msg.content.includes("🍆") || msg.content.includes("🍑") || msg.content.includes("مشمشة") || msg.content.includes("مشمش") || msg.content.includes("فالمقطع") || msg.content.includes("نسب") || msg.content.includes("اسب") || msg.content.includes("اليك") || msg.content.includes("العن") || msg.content.includes("كس") || msg.content.includes("زق") || msg.content.includes("http://") || msg.content.includes("زغلت") || msg.content.includes("زغل")) return msg.delete()
    if (msg.content.length < 40) return msg.delete()
    msg.delete()
    let embed = new Discord.MessageEmbed()
      .setAuthor("قصة من : " + msg.author.tag, msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setFooter(msg.author.id)
      .setDescription(`> ${msg.content.split("\n").join("\n> ")}`)
      .setThumbnail(msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    msg.channel.send(embed).then(() => {
      msg.channel.send({ files: [line] })
    })
  }
})

client.on("message", async msg => {
  if (msg.channel.type === "dm") return
  var prefix = db.get(`po_${msg.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${msg.guild.id}`);
  if (color === null) color = cc;
  if (msg.channel.id === "866556565312765952") {
    if (msg.author.bot) return
    if (msg.content.includes("https://") || msg.content.includes("discord.gg/") || msg.content.includes("ضرطاتي") || msg.content.includes("طقعة") || msg.content.includes("طقعه") || msg.content.includes("زق") || msg.content.includes("زقيت") || msg.content.includes("طقعت") || msg.content.includes("طقعتي") || msg.content.includes("طقوعه") || msg.content.includes("طقوعة") || msg.content.includes("خرا") || msg.content.includes("طقع") || msg.content.includes("طقعو") || msg.content.includes("طقعات") || msg.content.includes("ابول") || msg.content.includes("بول") || msg.content.includes("شخيت") || msg.content.includes("شخة") || msg.content.includes("شخه") || msg.content.includes("زقة") || msg.content.includes("زقه") || msg.content.includes("ز.") || msg.content.includes("اطكع") || msg.content.includes("طكعة") || msg.content.includes("طكعت") || msg.content.includes("ضرطه") || msg.content.includes("ضرطة") || msg.content.includes("ضرطت") || msg.content.includes("ضرطات") || msg.content.includes("ضرطتي") || msg.content.includes("ضروطة") || msg.content.includes("💩") || msg.content.includes(":poop:") || msg.content.includes("جرس") || msg.content.includes("متابعين") || msg.content.includes("تابعني") || msg.content.includes("قناتي") || msg.content.includes("كورونا") || msg.content.includes("فيديو") || msg.content.includes("مقطع") || msg.content.includes("ابوفله") || msg.content.includes("ابوفلة") || msg.content.includes("ابو فله") || msg.content.includes("ابو فلة") || msg.content.includes("بالروضة") || msg.content.includes("الروضة") || msg.content.includes("الابتدائية") || msg.content.includes("العن") || msg.content.includes("يلعن") || msg.content.includes("تبن") || msg.content.includes("حسران") || msg.content.includes("حشران") || msg.content.includes("متوسط") || msg.content.includes("بندرتينة") || msg.content.includes("بندرتينا") || msg.content.includes("محتواك") || msg.content.includes("قناتك") || msg.content.includes(":peach:") || msg.content.includes(":eggplant:") || msg.content.includes("🍆") || msg.content.includes("🍑") || msg.content.includes("مشمشة") || msg.content.includes("مشمش") || msg.content.includes("فالمقطع") || msg.content.includes("نسب") || msg.content.includes("اسب") || msg.content.includes("اليك") || msg.content.includes("العن") || msg.content.includes("كس") || msg.content.includes("زق") || msg.content.includes("http://") || msg.content.includes("زغلت") || msg.content.includes("زغل") || msg.content.includes("knife") || msg.content.includes("cs: go") || msg.content.includes("cs:go")) return msg.delete()
    if (msg.content.length < 5) return msg.delete()
    msg.delete()
    let embed = new Discord.MessageEmbed()
      .setAuthor("نكتة من : " + msg.author.tag, msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setFooter(msg.author.id)
      .setDescription(`> ${msg.content.split("\n").join("\n> ")}`)
      .setThumbnail(msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    msg.channel.send(embed).then(() => {
      msg.channel.send({ files: [line] })
    })
  }
})

client.on("message", async msg => {
  if (msg.channel.type === "dm") return
  var prefix = db.get(`po_${msg.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${msg.guild.id}`);
  if (color === null) color = cc;
  if (msg.channel.id === "859949145129484328") {
    if (msg.author.bot) return
    if (msg.content.includes("https://") || msg.content.includes("discord.gg/") || msg.content.includes("ضرطاتي") || msg.content.includes("طقعة") || msg.content.includes("طقعه") || msg.content.includes("زق") || msg.content.includes("زقيت") || msg.content.includes("طقعت") || msg.content.includes("طقعتي") || msg.content.includes("طقوعه") || msg.content.includes("طقوعة") || msg.content.includes("خرا") || msg.content.includes("طقع") || msg.content.includes("طقعو") || msg.content.includes("طقعات") || msg.content.includes("ابول") || msg.content.includes("بول") || msg.content.includes("شخيت") || msg.content.includes("شخة") || msg.content.includes("شخه") || msg.content.includes("زقة") || msg.content.includes("زقه") || msg.content.includes("ز.") || msg.content.includes("اطكع") || msg.content.includes("طكعة") || msg.content.includes("طكعت") || msg.content.includes("ضرطه") || msg.content.includes("ضرطة") || msg.content.includes("ضرطت") || msg.content.includes("ضرطات") || msg.content.includes("ضرطتي") || msg.content.includes("ضروطة") || msg.content.includes("💩") || msg.content.includes(":poop:") || msg.content.includes("لايك") || msg.content.includes("اشتراك") || msg.content.includes("جرس") || msg.content.includes("الجرس") || msg.content.includes("التنبيهات") || msg.content.includes("متابعين") || msg.content.includes("تابعني") || msg.content.includes("قناتي") || msg.content.includes("فاتح المايك") || msg.content.includes("كورونا") || msg.content.includes("فيديو") || msg.content.includes("مقطع") || msg.content.includes("ابوفله") || msg.content.includes("ابوفلة") || msg.content.includes("ابو فله") || msg.content.includes("ابو فلة") || msg.content.includes("بالروضة") || msg.content.includes("الروضة") || msg.content.includes("الابتدائي") || msg.content.includes("الابتدائية") || msg.content.includes("العن") || msg.content.includes("يلعن") || msg.content.includes("تبن") || msg.content.includes("حسران") || msg.content.includes("حشران") || msg.content.includes("تدخن") || msg.content.includes("يدخن") || msg.content.includes("المتوسط") || msg.content.includes("متوسط") || msg.content.includes("بندرتينة") || msg.content.includes("بندرتينا") || msg.content.includes("محتواك") || msg.content.includes("قناتك") || msg.content.includes(":peach:") || msg.content.includes(":eggplant:") || msg.content.includes("🍆") || msg.content.includes("🍑") || msg.content.includes("مشمشة") || msg.content.includes("مشمش") || msg.content.includes("فالمقطع") || msg.content.includes("نسب") || msg.content.includes("اسب") || msg.content.includes("هاي") || msg.content.includes("قصتين") || msg.content.includes("اليك") || msg.content.includes("العن") || msg.content.includes("كس") || msg.content.includes("زق") || msg.content.includes("http://") || msg.content.includes("زغلت") || msg.content.includes("زغل")) return msg.delete()
    if (msg.content.length < 20) return msg.delete()
    msg.delete()
    let embed = new Discord.MessageEmbed()
      .setAuthor("تقديم من : " + msg.author.tag, msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setFooter(msg.author.id)
      .setDescription(`> ${msg.content.split("\n").join("\n> ")}`)
      .setThumbnail(msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    msg.channel.send(embed).then(() => {
      msg.channel.send({ files: [line] })
    })
  }
})

client.on("message", async msg => {
  if (msg.channel.type === "dm") return
  var prefix = db.get(`po_${msg.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${msg.guild.id}`);
  if (color === null) color = cc;
  if (msg.channel.id === "852182609169219624") {
    if (msg.author.bot) return
    if (msg.content.includes("https://") || msg.content.includes("discord.gg/") || msg.content.includes("ضرطاتي") || msg.content.includes("طقعة") || msg.content.includes("طقعه") || msg.content.includes("زق") || msg.content.includes("زقيت") || msg.content.includes("طقعت") || msg.content.includes("طقعتي") || msg.content.includes("طقوعه") || msg.content.includes("طقوعة") || msg.content.includes("خرا") || msg.content.includes("طقع") || msg.content.includes("طقعو") || msg.content.includes("طقعات") || msg.content.includes("ابول") || msg.content.includes("بول") || msg.content.includes("شخيت") || msg.content.includes("شخة") || msg.content.includes("شخه") || msg.content.includes("زقة") || msg.content.includes("زقه") || msg.content.includes("ز.") || msg.content.includes("اطكع") || msg.content.includes("طكعة") || msg.content.includes("طكعت") || msg.content.includes("ضرطه") || msg.content.includes("ضرطة") || msg.content.includes("ضرطت") || msg.content.includes("ضرطات") || msg.content.includes("ضرطتي") || msg.content.includes("ضروطة") || msg.content.includes("💩") || msg.content.includes(":poop:") || msg.content.includes("لايك") || msg.content.includes("اشتراك") || msg.content.includes("جرس") || msg.content.includes("الجرس") || msg.content.includes("التنبيهات") || msg.content.includes("متابعين") || msg.content.includes("تابعني") || msg.content.includes("قناتي") || msg.content.includes("فاتح المايك") || msg.content.includes("كورونا") || msg.content.includes("فيديو") || msg.content.includes("مقطع") || msg.content.includes("ابوفله") || msg.content.includes("ابوفلة") || msg.content.includes("ابو فله") || msg.content.includes("ابو فلة") || msg.content.includes("بالروضة") || msg.content.includes("الروضة") || msg.content.includes("الابتدائي") || msg.content.includes("الابتدائية") || msg.content.includes("العن") || msg.content.includes("يلعن") || msg.content.includes("تبن") || msg.content.includes("حسران") || msg.content.includes("حشران") || msg.content.includes("تدخن") || msg.content.includes("يدخن") || msg.content.includes("المتوسط") || msg.content.includes("متوسط") || msg.content.includes("بندرتينة") || msg.content.includes("بندرتينا") || msg.content.includes("محتواك") || msg.content.includes("قناتك") || msg.content.includes(":peach:") || msg.content.includes(":eggplant:") || msg.content.includes("🍆") || msg.content.includes("🍑") || msg.content.includes("مشمشة") || msg.content.includes("مشمش") || msg.content.includes("فالمقطع") || msg.content.includes("نسب") || msg.content.includes("اسب") || msg.content.includes("هاي") || msg.content.includes("قصتين") || msg.content.includes("اليك") || msg.content.includes("العن") || msg.content.includes("كس") || msg.content.includes("http://")
      || msg.content.includes("زغلت") || msg.content.includes("زغل")) return msg.delete()
    if (msg.content.length < 5) return msg.delete()
    msg.delete()
    let embed = new Discord.MessageEmbed()
      .setAuthor("اقتراح من : " + msg.author.tag, msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setFooter(msg.author.id)
      .setDescription(`> ${msg.content.split("\n").join("\n> ")}`)
      .setThumbnail(msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    msg.channel.send(embed).then(m => {
      m.react('<:Like_BNX:857678552840536065>').then(() => {
        m.react('<:Dislike_BNX:857679129351946280>').then(() => {
          msg.channel.send({ files: [line] })
        })
      })
    })
  }
})

client.on("message", async msg => {
  if (msg.channel.id === "837737324854902845") {
    if (msg.author.bot) return
    msg.react('<:Like_BNX:857678552840536065>').then(() => {
      msg.react('<:Dislike_BNX:857679129351946280>')
    })
  }
})

client.on("message", async msg => {
  if (msg.channel.id === "838930490873348106") {
    if(msg.member.hasPermission("ADMINISTRATOR")) return
    if (msg.author.bot) return
    if (!msg.attachments.first()) return msg.delete()
    msg.react('<:Like_BNX:857678552840536065>').then(() => {
      msg.channel.send({ files: [line] })
    })
  }
})

client.on("message", async msg => {
  if (msg.channel.id === "838844594313232406") {
    if (msg.author.id === client.user.id) return
    msg.channel.send({ files: [line] })
  }
})

client.on("message", async msg => {
  if (msg.channel.type === "dm") return
  var prefix = db.get(`po_${msg.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${msg.guild.id}`);
  if (color === null) color = cc;
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (msg.content.indexOf(prefix) !== 0) return;
  if (command === "help") {
    let embed = new Discord.MessageEmbed()
      .setAuthor(client.user.tag, client.user.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setColor(color)
      .addFields({
        name: "**🌍 General Commands :**",
        value: `\`${prefix}help\n${prefix}bot\n${prefix}ping\n${prefix}banner\n${prefix}splash\n${prefix}large\n${prefix}emojiinfo\n${prefix}color\``,
        inline: true
      }, {
          name: "**🛠 Admin Commands :**",
          value: `\`${prefix}setprefix\n${prefix}setcolor\n${prefix}setcolor\n${prefix}sugadd\n${prefix}lineadd\n${prefix}deleteadd\n${prefix}chatadd\n${prefix}stickyadd\n${prefix}autoadd\n${prefix}sugremove\n${prefix}lineremove\n${prefix}deleteremove\n${prefix}chatremove\n${prefix}stickyremove\n${prefix}autoremove\n${prefix}suglist\n${prefix}linelist\n${prefix}deletelist\n${prefix}chatlist\n${prefix}stickylist\n${prefix}autolist\n${prefix}embed\``,
          inline: true
        })
      .setFooter(msg.author.tag, msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
    msg.channel.send(embed)
  }
})

client.on("message", async msg => {
  if (msg.channel.type === "dm") return
  var prefix = db.get(`po_${msg.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${msg.guild.id}`);
  if (color === null) color = cc;
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (msg.content.indexOf(prefix) !== 0) return;
  if (command === "ping") {
    let embed = new Discord.MessageEmbed()
      .setAuthor(client.user.tag, client.user.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .addFields({
        name: "**Ping :**",
        value: `**Time Taken : \`${Date.now() - msg.createdTimestamp}ms\`\nDiscord API : \`${client.ws.ping}ms\`\nUptime : \`${ms(client.uptime)}\`**`,
        inline: true
      }, {
          name: "**Memory :**",
          value: `**RSS : \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(
            2
          )}MB\`\nHeap : \`${(
            process.memoryUsage().heapUsed /
            1024 /
            1024
          ).toFixed(2)}MB\`**`,
          inline: true
        })
      .setFooter(msg.author.tag, msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setColor(color)
      .setTimestamp()
    msg.channel.send(embed)
  }
})

client.on("message", async msg => {
  if (msg.channel.type === "dm") return
  var prefix = db.get(`po_${msg.guild.id}`);
  if (prefix === null) prefix = pp;

  var color = db.get(`co_${msg.guild.id}`);
  if (color === null) color = cc;
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (msg.content.indexOf(prefix) !== 0) return;
  if (command === "bot") {
    let embed = new Discord.MessageEmbed()
      .setFooter(msg.author.tag, msg.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setAuthor(client.user.tag, client.user.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .addField(`**Settings :**`, `**Server Prefix : \`${prefix}\`\nServer Color : \`${color}\`**`)
      .addFields({
        name: "**Info :**",
        value: `**Default Prefix : \`${pp}\`\nDefault Color : \`${cc}\`\nLanguage : JavaScript - Node.js\nLibrary : Discord.js**`,
        inline: true
      }, {
          name: "**Ping :**",
          value: `**Time Taken : \`${Date.now() - msg.createdTimestamp}ms\`\nDiscord API : \`${client.ws.ping}ms\`\nUptime : \`${ms(client.uptime)}\`**`,
          inline: true
        }, {
          name: "**Memory :**",
          value: `**RSS : \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(
            2
          )}MB\`\nHeap : \`${(
            process.memoryUsage().heapUsed /
            1024 /
            1024
          ).toFixed(2)}MB\`**`,
          inline: true
        })
      .setColor(color)
      .setTimestamp()
    msg.channel.send(embed)
  }
})
const Discord2 = require("discord.js")
const client2 = new Discord2.Client()
const DisTube = require("distube")
const prefix2 = '1'
client2.on('ready', () => {
  console.log(`${client2.user.tag} is ready`)
  client2.user.setActivity("BanderitaX", {
    type: "STREAMING",
    url: "https://www.twitch.tv/banderitax"
  })
})
// Music Data
const distube = new DisTube(client2, {
  searchSongs: false,
  emitNewSongOnly: true
});
// Music Data

// Music Cmds

client2.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "file") {
    const att = message.attachments.first()
    if (!att) return message.reply(`**❌ Error Please Put The Attachment**`)
    let bed = new Discord2.MessageEmbed()
      .setTitle("**" + att.name + "**")
      .setURL(att.url)
      .addField("**Played By :**", `**${message.author}**`)
      .setFooter(message.author.tag, message.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    distube.play(message, att.url)
    message.channel.send(bed)
    client2.channels.cache.get("854265212499394560").send(bed)
  }
})

client2.on('message', async (message) => {
  if (message.channel.type === "dm") return

  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "play") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)

    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)

    let music = message.content.split(' ').slice(1).join(' ')
    if (!music) return message.reply(`**❌ Error Please Put The Music Name**`)
    distube.play(message, music);
  }
});

client2.on("message", async message => {
  if (message.channel.type === "dm") return

  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "stop") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      distube.stop(message)
      message.channel.send(`**🎵 The Music Has Been Stopped And The Queue Has Been Cleared**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client2.on("message", async message => {
  if (message.channel.type === "dm") return

  if (message.content === prefix2 + "skip") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      distube.skip(message)
      message.channel.send(`**🎵 The Music Has Been Skipped**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client2.on('message', async (message) => {
  if (message.channel.type === "dm") return

  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "repeat" || command === "loop") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      let mode = distube.setRepeatMode(message, parseInt(args[0]));
      mode = mode ? mode == 2 ? "Repeat Queue" : "Repeat Song" : "OFF";
      message.channel.send(`🎵 The Repeat Mode Has Been Set To **\`${mode}\`**`);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
});

client2.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "volume" || command === "vol") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      const stats = `${que.volume}%`
      let vol = message.content.split(' ').slice(1)
      if (!vol[0]) return message.reply(`**🎵 The Music Volume is \`${stats}\`**`)
      if (parseInt(vol[0]) < 0 || parseInt(vol[0]) > 100) return message.reply(`**❌ Error You Can't Put Number Lower Than \`0\` Or More Than \`100\`**`)
      if (isNaN(vol[0])) return message.reply(`**❌ Error Invalid Number**`)
      distube.setVolume(message, vol)
      message.channel.send(`**🎵 The Music Volume Has Been Set To \`${vol[0]}%\`**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})


const { toColonNotation, toMilliseconds } = require('colon-notation');
client2.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "seek") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      let sek = message.content.split(' ').slice(1)
      if (!sek[0]) return message.reply(`**❌ Error Please Put a Number**`)
      distube.seek(message, Number(toMilliseconds(sek[0])))
      message.channel.send(`**🎵 The Music Has Been Seeked To \`${sek[0]}\`**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})
const progressbar = require("string-progressbar")
client2.on("message", async message => {
  if (message.channel.type === "dm") return
  if (message.content.toLowerCase().startsWith(prefix2 + "nowplaying") || message.content.toLowerCase().startsWith(prefix2 + "np")) {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    const que = await distube.getQueue(message)
    if (que) {
      let track = que.songs[0]
      let time = track.duration * 1000
      const currentTime = que.currentTime;
      let sng = que.songs[0]
      var embed = new Discord.MessageEmbed()
        .setTitle("**" + sng.name + "**")
        .setURL(sng.url)
        .addField("**Published By :**", `**[${sng.info.videoDetails.ownerChannelName}](${sng.info.videoDetails.ownerProfileUrl})**`)
        .addField("**Views :**", `**${sng.views}**`)
        .addField("**Duration :**", `**[${progressbar.splitBar(time === 0 ? currentTime : time, currentTime, 10)[0]}]\n\`[${que.formattedCurrentTime}/${track.formattedDuration}]\`**`)
        .addField("**Played By :**", `**${sng.user}**`)
        .setImage(`${sng.thumbnail}`)
        .setFooter(`👍 ${sng.likes} | 👎 ${sng.dislikes}`, sng.user.avatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setColor(color)
      message.channel.send(embed)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client2.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "pause") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      distube.pause(message)
      message.channel.send(`**🎵 The Music Has Been Paused**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client2.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "resume") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      distube.resume(message)
      message.channel.send(`**🎵 The Music Has Been Resumed**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client2.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "shuffle") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      distube.shuffle(message)
      message.channel.send(`**🎵 The Music Has Been Shuffled**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client2.on('message', async (message) => {
  if (message.channel.type === "dm") return
  let que = await distube.getQueue(message)
  if (!message.content.startsWith(prefix2)) return;
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift();
  if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`, `flanger`, `gate`, `haas`, `reverse`, `surround`, `mcompand`, `phaser`, `tremolo`, `earwax`].includes(command)) {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    if (que) {
      let filter = distube.setFilter(message, command);
      message.channel.send(`🎵 Music Filter Has Been Set To **\`${(filter || "OFF")}\`**`);
    } else if (!que) {
      message.channel.send(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
});

client2.on('message', async (message) => {
  if (message.channel.type === "dm") return
  if (!message.content.startsWith(prefix2)) return;
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift();
  if (command == "queue") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let qu = await distube.getQueue(message)
    if (qu) {
      let queue = distube.getQueue(message);
      message.channel.send(new Discord2.MessageEmbed().setDescription(`**${queue.songs.map((song, id) =>
        `${id + 1} - [${song.name}](${song.url}) - \`${song.formattedDuration}\``
      ).join("\n")}**`).setFooter(message.author.tag, message.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      })).setTitle("🎵 Queue List").setThumbnail(message.guild.iconURL({
        format: "png",
        size: 4096,
        dynamic: true
      })).setTimestamp().setColor(color));
    } else if (!qu) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
    }
  }
});

client2.on('message', async (message) => {
  if (message.channel.type === "dm") return
  if (!message.content.startsWith(prefix2)) return;
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == "skipto") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      let skipnum = message.content.split(' ').slice(1)
      if (!skipnum[0]) return message.reply(`**❌ Error Please Put The Music Number**`)
      distube.jump(message, parseInt(skipnum[0]))
        .catch(err => {
          return message.reply(`**❌ Error Invalid Music Number**`)
        });
      message.channel.send(`**🎵 The Music Has Been Skipped**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
    }
  }
});

client2.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "disconnect" || command === "dc") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const me = message.guild.me.voice.channel
    const channel = message.member.voice.channel
    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    if (message.guild.me.voice.channel) {
      message.guild.me.voice.channel.leave()
      message.react("👋")
    }
  }
})

client2.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "join") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const me = message.guild.me.voice.channel
    const channel = message.member.voice.channel
    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    message.member.voice.channel.join()
    message.react("👋")
  }
})

client2.on('message', async (message) => {
  if (message.channel.type === "dm") return
  var prefix = db.fetch(`po_${message.guild.id}`)
  if (prefix === null) prefix = pp;
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix2) !== 0) return;
  if (command === "replay") {
    const que = await distube.getQueue(message)
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)

    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    if (que) {
      distube.stop(message)
      distube.play(message, que.songs[0].url);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
});

client2.on("message", message => {
  if (message.channel.type === "dm") return;
  if (!message.content.startsWith(prefix2)) return;
  const args = message.content.slice(prefix2.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == "youtube") {
    let channel = message.member.voice.channel;
    if (!channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
      method: "POST",
      body: JSON.stringify({
        max_age: 86400,
        max_uses: 0,
        target_application_id: "755600276941176913",
        target_type: 2,
        temporary: false,
        validate: null
      }),
      headers: {
        "Authorization": `Bot ${client2.token}`,
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(invite => {
        if (!invite.code) return message.reply(`**❌ Error I Can't Start YouTube Together**`)
        message.channel.send(`**✅ Done Click On The Link To Start YouTube Together\nhttps://discord.com/invite/${invite.code}**`)
      })
  };
});

const lyricsFinder = require('lyrics-finder');
client2.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === "lyrics") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    let que = await distube.getQueue(message)
    if (que) {
      (async function(artist, title) {
        let lyrics = await lyricsFinder(artist, title) || "Not Found!";
        message.channel.send(new Discord.MessageEmbed().setAuthor(client.user.tag, client.user.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        })).setTitle(`**${que.songs[0].name} Lyrics**`).setDescription(lyrics).setColor(color).setFooter("Requested By " + message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))).catch(error => {
          message.channel.send(`**❌ Error The Song Characters More Than 200**`)
          console.log(error)
        });
      })(que.songs[0].name, '');
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})
// Music Cmds

// Music Src
distube
  .on("playSong", async (message, queue, song) => {
    var embed = new Discord2.MessageEmbed()
      .setTitle("**" + song.name + "**")
      .setURL(song.url)
      .addField("**Published By :**", `**[${song.info.videoDetails.ownerChannelName}](${song.info.videoDetails.ownerProfileUrl})**`)
      .addField("**Views :**", `**${song.views}**`)
      .addField("**Duration :**", `**${song.formattedDuration}**`)
      .addField("**Played By :**", `**${song.user}**`)
      .setImage(`${song.thumbnail}`)
      .setFooter(`👍 ${song.likes} | 👎 ${song.dislikes}`, song.user.avatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    message.channel.send(embed)
    client2.channels.cache.get("854265212499394560").send(embed)
  })
  .on("addSong", async (message, queue, song) => {
    var embed = new Discord2.MessageEmbed()
      .setTitle("**" + song.name + "**")
      .setURL(song.url)
      .addField("**Published By :**", `**[${song.info.videoDetails.ownerChannelName}](${song.info.videoDetails.ownerProfileUrl})**`)
      .addField("**Views :**", `**${song.views}**`)
      .addField("**Duration :**", `**${song.formattedDuration}**`)
      .addField("**Added By :**", `**${song.user}**`)
      .setImage(`${song.thumbnail}`)
      .setFooter(`👍 ${song.likes} | 👎 ${song.dislikes}`, song.user.avatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    message.channel.send(embed)
    client2.channels.cache.get("854265212499394560").send(embed)
  })

  .on("playList", async (message, queue, playlist, song) => {
    var embed = new Discord2.MessageEmbed()
      .setTitle("**" + playlist.name + "**")
      .setURL(playlist.url)
      .addField("**Music Count :**", `**${playlist.songs.length}**`)
      .addField("**Played By :**", `**${playlist.user}**`)
      .setImage(`${playlist.thumbnail.url}`)
      .setFooter(playlist.user.tag, playlist.user.avatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    message.channel.send(embed)
    client2.channels.cache.get("854265212499394560").send(embed)

  })

  .on("addList", async (message, queue, playlist) => {
    var embed = new Discord2.MessageEmbed()
      .setTitle("**" + playlist.name + "**")
      .setURL(playlist.url)
      .addField("**Music Count :**", `**${playlist.songs.length}**`)
      .addField("**Added By :**", `**${playlist.user}**`)
      .setImage(`${playlist.thumbnail.url}`)
      .setFooter(playlist.user.tag, playlist.user.avatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    message.channel.send(embed)
    client2.channels.cache.get("854265212499394560").send(embed)

  })
  .on("searchResult", async (message, result) => {
    var color = db.get(`co_${message.guild.id}`);
    if (color === null) color = cc;
    let i = 0;
    message.channel.send(new Discord2.MessageEmbed().setTitle(`**🎵 Please Put a Number**`).setDescription(`**${result.map(song => `${++i} - [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join("\n")}**`).setColor(color).setThumbnail(message.guild.iconURL({
      format: "png",
      size: 4096,
      dynamic: true
    })).setFooter(`You Have 60s To Put a Number`, message.author.displayAvatarURL({
      format: "png",
      size: 4096,
      dynamic: true
    })).setTimestamp());
  })
  .on("searchCancel", (message) => message.channel.send(`**❗ Searching Has Been Stop**`))
  .on("error", (message, e) => {
    console.error(e)
  })
  .on("initQueue", queue => {
    queue.autoplay = false;
    queue.volume = 100;
  });
// Music Src



const Discord3 = require("discord.js")
const client3 = new Discord3.Client()
const DisTube3 = require("distube")
const prefix3 = '2'
client3.on('ready', () => {
  console.log(`${client3.user.tag} is ready`)
  client3.user.setActivity("BanderitaX", {
    type: "STREAMING",
    url: "https://www.twitch.tv/banderitax"
  })
})
// Music Data
const distube3 = new DisTube3(client3, {
  searchSongs: false,
  emitNewSongOnly: true
});
// Music Data

// Music Cmds

client3.on("message", message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "file") {
    const att = message.attachments.first()
    if (!att) return message.reply(`**❌ Error Please Put The Attachment**`)
    let bed = new Discord3.MessageEmbed()
      .setTitle("**" + att.name + "**")
      .setURL(att.url)
      .addField("**Played By :**", `**${message.author}**`)
      .setFooter(message.author.tag, message.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    distube3.play(message, att.url)
    message.channel.send(bed)
    client3.channels.cache.get("854265212499394560").send(bed)
  }
})

client3.on('message', async (message) => {
  if (message.channel.type === "dm") return

  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "play") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)

    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)

    let music = message.content.split(' ').slice(1).join(' ')
    if (!music) return message.reply(`**❌ Error Please Put The Music Name**`)
    distube3.play(message, music);
  }
});

client3.on("message", async message => {
  if (message.channel.type === "dm") return

  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "stop") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      distube3.stop(message)
      message.channel.send(`**🎵 The Music Has Been Stopped And The Queue Has Been Cleared**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client3.on("message", async message => {
  if (message.channel.type === "dm") return

  if (message.content === prefix3 + "skip") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      distube3.skip(message)
      message.channel.send(`**🎵 The Music Has Been Skipped**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client3.on('message', async (message) => {
  if (message.channel.type === "dm") return

  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "repeat" || command === "loop") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      let mode = distube3.setRepeatMode(message, parseInt(args[0]));
      mode = mode ? mode == 2 ? "Repeat Queue" : "Repeat Song" : "OFF";
      message.channel.send(`🎵 The Repeat Mode Has Been Set To **\`${mode}\`**`);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
});

client3.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "volume" || command === "vol") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      const stats = `${que.volume}%`
      let vol = message.content.split(' ').slice(1)
      if (!vol[0]) return message.reply(`**🎵 The Music Volume is \`${stats}\`**`)
      if (parseInt(vol[0]) < 0 || parseInt(vol[0]) > 100) return message.reply(`**❌ Error You Can't Put Number Lower Than \`0\` Or More Than \`100\`**`)
      if (isNaN(vol[0])) return message.reply(`**❌ Error Invalid Number**`)
      distube3.setVolume(message, vol)
      message.channel.send(`**🎵 The Music Volume Has Been Set To \`${vol[0]}%\`**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})


client3.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "seek") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      let sek = message.content.split(' ').slice(1)
      if (!sek[0]) return message.reply(`**❌ Error Please Put a Number**`)
      distube3.seek(message, Number(toMilliseconds(sek[0])))
      message.channel.send(`**🎵 The Music Has Been Seeked To \`${sek[0]}\`**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})
client3.on("message", async message => {
  if (message.channel.type === "dm") return
  if (message.content.toLowerCase().startsWith(prefix3 + "nowplaying") || message.content.toLowerCase().startsWith(prefix3 + "np")) {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    const que = await distube3.getQueue(message)
    if (que) {
      let track = que.songs[0]
      let time = track.duration * 1000
      const currentTime = que.currentTime;
      let sng = que.songs[0]
      var embed = new Discord.MessageEmbed()
        .setTitle("**" + sng.name + "**")
        .setURL(sng.url)
        .addField("**Published By :**", `**[${sng.info.videoDetails.ownerChannelName}](${sng.info.videoDetails.ownerProfileUrl})**`)
        .addField("**Views :**", `**${sng.views}**`)
        .addField("**Duration :**", `**[${progressbar.splitBar(time === 0 ? currentTime : time, currentTime, 10)[0]}]\n\`[${que.formattedCurrentTime}/${track.formattedDuration}]\`**`)
        .addField("**Played By :**", `**${sng.user}**`)
        .setImage(`${sng.thumbnail}`)
        .setFooter(`👍 ${sng.likes} | 👎 ${sng.dislikes}`, sng.user.avatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setColor(color)
      message.channel.send(embed)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client3.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "pause") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      distube3.pause(message)
      message.channel.send(`**🎵 The Music Has Been Paused**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client3.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "resume") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      distube3.resume(message)
      message.channel.send(`**🎵 The Music Has Been Resumed**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client3.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "shuffle") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      distube3.shuffle(message)
      message.channel.send(`**🎵 The Music Has Been Shuffled**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client3.on('message', async (message) => {
  if (message.channel.type === "dm") return
  let que = await distube3.getQueue(message)
  if (!message.content.startsWith(prefix3)) return;
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift();
  if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`, `flanger`, `gate`, `haas`, `reverse`, `surround`, `mcompand`, `phaser`, `tremolo`, `earwax`].includes(command)) {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    if (que) {
      let filter = distube3.setFilter(message, command);
      message.channel.send(`🎵 Music Filter Has Been Set To **\`${(filter || "OFF")}\`**`);
    } else if (!que) {
      message.channel.send(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
});

client3.on('message', async (message) => {
  if (message.channel.type === "dm") return
  if (!message.content.startsWith(prefix3)) return;
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift();
  if (command == "queue") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let qu = await distube3.getQueue(message)
    if (qu) {
      let queue = distube3.getQueue(message);
      message.channel.send(new Discord3.MessageEmbed().setDescription(`**${queue.songs.map((song, id) =>
        `${id + 1} - [${song.name}](${song.url}) - \`${song.formattedDuration}\``
      ).join("\n")}**`).setFooter(message.author.tag, message.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      })).setTitle("🎵 Queue List").setThumbnail(message.guild.iconURL({
        format: "png",
        size: 4096,
        dynamic: true
      })).setTimestamp().setColor(color));
    } else if (!qu) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
    }
  }
});

client3.on('message', async (message) => {
  if (message.channel.type === "dm") return
  if (!message.content.startsWith(prefix3)) return;
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == "skipto") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      let skipnum = message.content.split(' ').slice(1)
      if (!skipnum[0]) return message.reply(`**❌ Error Please Put The Music Number**`)
      distube3.jump(message, parseInt(skipnum[0]))
        .catch(err => {
          return message.reply(`**❌ Error Invalid Music Number**`)
        });
      message.channel.send(`**🎵 The Music Has Been Skipped**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
    }
  }
});

client3.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "disconnect" || command === "dc") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const me = message.guild.me.voice.channel
    const channel = message.member.voice.channel
    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    if (message.guild.me.voice.channel) {
      message.guild.me.voice.channel.leave()
      message.react("👋")
    }
  }
})

client3.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "join") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const me = message.guild.me.voice.channel
    const channel = message.member.voice.channel
    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    message.member.voice.channel.join()
    message.react("👋")
  }
});

client3.on('message', async (message) => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "replay") {
    const que = await distube3.getQueue(message)
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)

    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    if (que) {
      distube3.stop(message)
      distube3.play(message, que.songs[0].url);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
});

client3.on("message", message => {
  if (message.channel.type === "dm") return;
  if (!message.content.startsWith(prefix3)) return;
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == "youtube") {
    let channel = message.member.voice.channel;
    if (!channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
      method: "POST",
      body: JSON.stringify({
        max_age: 86400,
        max_uses: 0,
        target_application_id: "755600276941176913",
        target_type: 2,
        temporary: false,
        validate: null
      }),
      headers: {
        "Authorization": `Bot ${client3.token}`,
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(invite => {
        if (!invite.code) return message.reply(`**❌ Error I Can't Start YouTube Together**`)
        message.channel.send(`**✅ Done Click On The Link To Start YouTube Together\nhttps://discord.com/invite/${invite.code}**`)
      })
  };
});

client3.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix3.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix3) !== 0) return;
  if (command === "lyrics") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    let que = await distube3.getQueue(message)
    if (que) {
      (async function(artist, title) {
        let lyrics = await lyricsFinder(artist, title) || "Not Found!";
        message.channel.send(new Discord.MessageEmbed().setAuthor(client.user.tag, client.user.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        })).setTitle(`**${que.songs[0].name} Lyrics**`).setDescription(lyrics).setColor(color).setFooter("Requested By " + message.author.tag, message.author.displayAvatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))).catch(error => {
          message.channel.send(`**❌ Error The Song Characters More Than 200**`)
          console.log(error)
        });
      })(que.songs[0].name, '');
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
});
// Music Cmds

// Music Src
distube3
  .on("playSong", async (message, queue, song) => {
    var embed = new Discord3.MessageEmbed()
      .setTitle("**" + song.name + "**")
      .setURL(song.url)
      .addField("**Published By :**", `**[${song.info.videoDetails.ownerChannelName}](${song.info.videoDetails.ownerProfileUrl})**`)
      .addField("**Views :**", `**${song.views}**`)
      .addField("**Duration :**", `**${song.formattedDuration}**`)
      .addField("**Played By :**", `**${song.user}**`)
      .setImage(`${song.thumbnail}`)
      .setFooter(`👍 ${song.likes} | 👎 ${song.dislikes}`, song.user.avatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    message.channel.send(embed)
    client3.channels.cache.get("854265212499394560").send(embed)
  })
  .on("addSong", async (message, queue, song) => {
    var embed = new Discord3.MessageEmbed()
      .setTitle("**" + song.name + "**")
      .setURL(song.url)
      .addField("**Published By :**", `**[${song.info.videoDetails.ownerChannelName}](${song.info.videoDetails.ownerProfileUrl})**`)
      .addField("**Views :**", `**${song.views}**`)
      .addField("**Duration :**", `**${song.formattedDuration}**`)
      .addField("**Added By :**", `**${song.user}**`)
      .setImage(`${song.thumbnail}`)
      .setFooter(`👍 ${song.likes} | 👎 ${song.dislikes}`, song.user.avatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    message.channel.send(embed)
    client3.channels.cache.get("854265212499394560").send(embed)
  })

  .on("playList", async (message, queue, playlist, song) => {
    var embed = new Discord3.MessageEmbed()
      .setTitle("**" + playlist.name + "**")
      .setURL(playlist.url)
      .addField("**Music Count :**", `**${playlist.songs.length}**`)
      .addField("**Played By :**", `**${playlist.user}**`)
      .setImage(`${playlist.thumbnail.url}`)
      .setFooter(playlist.user.tag, playlist.user.avatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    message.channel.send(embed)
    client3.channels.cache.get("854265212499394560").send(embed)

  })

  .on("addList", async (message, queue, playlist) => {
    var embed = new Discord3.MessageEmbed()
      .setTitle("**" + playlist.name + "**")
      .setURL(playlist.url)
      .addField("**Music Count :**", `**${playlist.songs.length}**`)
      .addField("**Added By :**", `**${playlist.user}**`)
      .setImage(`${playlist.thumbnail.url}`)
      .setFooter(playlist.user.tag, playlist.user.avatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
      .setColor(color)
    message.channel.send(embed)
    client3.channels.cache.get("854265212499394560").send(embed)

  })
  .on("searchResult", async (message, result) => {
    var color = db.get(`co_${message.guild.id}`);
    if (color === null) color = cc;
    let i = 0;
    message.channel.send(new Discord3.MessageEmbed().setTitle(`**🎵 Please Put a Number**`).setDescription(`**${result.map(song => `${++i} - [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join("\n")}**`).setColor(color).setThumbnail(message.guild.iconURL({
      format: "png",
      size: 4096,
      dynamic: true
    })).setFooter(`You Have 60s To Put a Number`, message.author.displayAvatarURL({
      format: "png",
      size: 4096,
      dynamic: true
    })).setTimestamp());
  })
  .on("searchCancel", (message) => message.channel.send(`**❗ Searching Has Been Stop**`))
  .on("error", (message, e) => {
    console.error(e)
  })
  .on("initQueue", queue => {
    queue.autoplay = false;
    queue.volume = 100;
  });
// Music Src

client2.on("message", message => {
  var prefix = prefix2;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === "help") {
    const embed = new Discord2.MessageEmbed()
      .addField("**🎵 Music Commands :**", `\`${prefix}play\n${prefix}replay\n${prefix}stop\n${prefix}skip\n${prefix}skipto\n${prefix}loop\n${prefix}volume\n${prefix}seek\n${prefix}pause\n${prefix}resume\n${prefix}shuffle\n${prefix}queue\n${prefix}np\n${prefix}lyrics\n${prefix}join\n${prefix}disconnect\n${prefix}youtube\``, true)
      .addField("**🎧 Music Filters :**", `\`${prefix}3d\n${prefix}bassboost\n${prefix}echo\n${prefix}karaoke\n${prefix}nightcore\n${prefix}vaporwave\n${prefix}flanger\n${prefix}gate\n${prefix}haas\n${prefix}reverse\n${prefix}surround\n${prefix}mcompand\n${prefix}phaser\n${prefix}tremolo\n${prefix}earwax\``, true)
      .setColor(color)
      .setAuthor(client2.user.tag, client2.user.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setFooter(message.author.tag, message.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
    message.channel.send(embed)
  }
})

client3.on("message", message => {
  var prefix = prefix3;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === "help") {
    const embed = new Discord3.MessageEmbed()
      .addField("**🎵 Music Commands :**", `\`${prefix}play\n${prefix}replay\n${prefix}stop\n${prefix}skip\n${prefix}skipto\n${prefix}loop\n${prefix}volume\n${prefix}seek\n${prefix}pause\n${prefix}resume\n${prefix}shuffle\n${prefix}queue\n${prefix}np\n${prefix}lyrics\n${prefix}join\n${prefix}disconnect\n${prefix}youtube\``, true)
      .addField("**🎧 Music Filters :**", `\`${prefix}3d\n${prefix}bassboost\n${prefix}echo\n${prefix}karaoke\n${prefix}nightcore\n${prefix}vaporwave\n${prefix}flanger\n${prefix}gate\n${prefix}haas\n${prefix}reverse\n${prefix}surround\n${prefix}mcompand\n${prefix}phaser\n${prefix}tremolo\n${prefix}earwax\``, true)
      .setColor(color)
      .setAuthor(client3.user.tag, client3.user.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setFooter(message.author.tag, message.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
    message.channel.send(embed)
  }
})

const Discord4 = require('discord.js');
const client4 = new Discord4.Client();
const DisTube4 = require('distube');
const prefix4 = '3';
client4.on('ready', () => {
  console.log(`${client4.user.tag} is ready`);
  client4.user.setActivity('BanderitaX', {
    type: 'STREAMING',
    url: 'https://www.twitch.tv/banderitax'
  });
});
// Music Data
const distube4 = new DisTube4(client4, {
  searchSongs: false,
  emitNewSongOnly: true
});
// Music Data

// Music Cmds

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'file') {
    const att = message.attachments.first();
    if (!att) return message.reply(`**❌ Error Please Put The Attachment**`);
    let bed = new Discord4.MessageEmbed()
      .setTitle('**' + att.name + '**')
      .setURL(att.url)
      .addField('**Played By :**', `**${message.author}**`)
      .setFooter(
        message.author.tag,
        message.author.displayAvatarURL({
          format: 'png',
          size: 4096,
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor(color);
    distube4.play(message, att.url);
    message.channel.send(bed);
    client4.channels.cache.get('854265212499394560').send(bed);
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;

  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'play') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);

    let music = message.content
      .split(' ')
      .slice(1)
      .join(' ');
    if (!music) return message.reply(`**❌ Error Please Put The Music Name**`);
    distube4.play(message, music);
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;

  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'stop') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    let que = await distube4.getQueue(message);
    if (que) {
      distube4.stop(message);
      message.channel.send(
        `**🎵 The Music Has Been Stopped And The Queue Has Been Cleared**`
      );
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  if (message.content.toLowerCase() === prefix4 + 'skip') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    let que = await distube4.getQueue(message);
    if (que) {
      distube4.skip(message);
      message.channel.send(`**🎵 The Music Has Been Skipped**`);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;

  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'repeat' || command === 'loop') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    let que = await distube4.getQueue(message);
    if (que) {
      let mode = distube4.setRepeatMode(message, parseInt(args[0]));
      mode = mode ? (mode == 2 ? 'Repeat Queue' : 'Repeat Song') : 'OFF';
      message.channel.send(
        `🎵 The Repeat Mode Has Been Set To **\`${mode}\`**`
      );
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'volume' || command === 'vol') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    let que = await distube4.getQueue(message);
    if (que) {
      const stats = `${que.volume}%`;
      let vol = message.content.split(' ').slice(1);
      if (!vol[0])
        return message.reply(`**🎵 The Music Volume is \`${stats}\`**`);
      if (parseInt(vol[0]) < 0 || parseInt(vol[0]) > 100)
        return message.reply(
          `**❌ Error You Can't Put Number Lower Than \`0\` Or More Than \`100\`**`
        );
      if (isNaN(vol[0])) return message.reply(`**❌ Error Invalid Number**`);
      distube4.setVolume(message, vol);
      message.channel.send(
        `**🎵 The Music Volume Has Been Set To \`${vol[0]}%\`**`
      );
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});

client4.on("message", async message => {
  if (message.channel.type === "dm") return
  const args = message.content.slice(prefix4.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === "seek") {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    let que = await distube4.getQueue(message)
    if (que) {
      let sek = message.content.split(' ').slice(1)
      if (!sek[0]) return message.reply(`**❌ Error Please Put a Number**`)
      distube4.seek(message, Number(toMilliseconds(sek[0])))
      message.channel.send(`**🎵 The Music Has Been Seeked To \`${sek[0]}\`**`)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client4.on("message", async message => {
  if (message.channel.type === "dm") return
  if (message.content.toLowerCase().startsWith(prefix4 + "nowplaying") || message.content.toLowerCase().startsWith(prefix4 + "np")) {
    if (!message.member.voice.channel) return message.reply(`**❌ Error You're Not in Voice Channel**`)
    const channel = message.member.voice.channel
    const me = message.guild.me.voice.channel

    if (me && me.id !== channel.id) return message.reply(`**❌ Error You Must Be Listening To ${me}**`)
    const que = await distube4.getQueue(message)
    if (que) {
      let track = que.songs[0]
      let time = track.duration * 1000
      const currentTime = que.currentTime;
      let sng = que.songs[0]
      var embed = new Discord.MessageEmbed()
        .setTitle("**" + sng.name + "**")
        .setURL(sng.url)
        .addField("**Published By :**", `**[${sng.info.videoDetails.ownerChannelName}](${sng.info.videoDetails.ownerProfileUrl})**`)
        .addField("**Views :**", `**${sng.views}**`)
        .addField("**Duration :**", `**[${progressbar.splitBar(time === 0 ? currentTime : time, currentTime, 10)[0]}]\n\`[${que.formattedCurrentTime}/${track.formattedDuration}]\`**`)
        .addField("**Played By :**", `**${sng.user}**`)
        .setImage(`${sng.thumbnail}`)
        .setFooter(`👍 ${sng.likes} | 👎 ${sng.dislikes}`, sng.user.avatarURL({
          format: "png",
          size: 4096,
          dynamic: true
        }))
        .setTimestamp()
        .setColor(color)
      message.channel.send(embed)
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`)
      return
    }
  }
})

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'pause') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    let que = await distube4.getQueue(message);
    if (que) {
      distube4.pause(message);
      message.channel.send(`**🎵 The Music Has Been Paused**`);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'resume') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    let que = await distube4.getQueue(message);
    if (que) {
      distube4.resume(message);
      message.channel.send(`**🎵 The Music Has Been Resumed**`);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'shuffle') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    let que = await distube4.getQueue(message);
    if (que) {
      distube4.shuffle(message);
      message.channel.send(`**🎵 The Music Has Been Shuffled**`);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  let que = await distube4.getQueue(message);
  if (!message.content.startsWith(prefix4)) return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift();
  if (
    [
      `3d`,
      `bassboost`,
      `echo`,
      `karaoke`,
      `nightcore`,
      `vaporwave`,
      `flanger`,
      `gate`,
      `haas`,
      `reverse`,
      `surround`,
      `mcompand`,
      `phaser`,
      `tremolo`,
      `earwax`
    ].includes(command)
  ) {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    if (que) {
      let filter = distube4.setFilter(message, command);
      message.channel.send(
        `🎵 Music Filter Has Been Set To **\`${filter || 'OFF'}\`**`
      );
    } else if (!que) {
      message.channel.send(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  if (!message.content.startsWith(prefix4)) return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift();
  if (command == 'queue') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    let qu = await distube4.getQueue(message);
    if (qu) {
      let queue = distube4.getQueue(message);
      message.channel.send(
        new Discord4.MessageEmbed()
          .setDescription(
            `**${queue.songs
              .map(
                (song, id) =>
                  `${id + 1} - [${song.name}](${song.url}) - \`${
                  song.formattedDuration
                  }\``
              )
              .join('\n')}**`
          )
          .setFooter(
            message.author.tag,
            message.author.displayAvatarURL({
              format: 'png',
              size: 4096,
              dynamic: true
            })
          )
          .setTitle('🎵 Queue List')
          .setThumbnail(
            message.guild.iconURL({
              format: 'png',
              size: 4096,
              dynamic: true
            })
          )
          .setTimestamp()
          .setColor(color)
      );
    } else if (!qu) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  if (!message.content.startsWith(prefix4)) return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == 'skipto') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening ${me}**`);
    let que = await distube4.getQueue(message);
    if (que) {
      let skipnum = message.content.split(' ').slice(1);
      if (!skipnum[0])
        return message.reply(`**❌ Error Please Put The Music Number**`);
      distube4.jump(message, parseInt(skipnum[0])).catch(err => {
        return message.reply(`**❌ Error Invalid Music Number**`);
      });
      message.channel.send(`**🎵 The Music Has Been Skipped**`);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'disconnect' || command === 'dc') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const me = message.guild.me.voice.channel;
    const channel = message.member.voice.channel;
    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening To ${me}**`);
    if (message.guild.me.voice.channel) {
      message.guild.me.voice.channel.leave();
      message.react('👋');
    }
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'join') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const me = message.guild.me.voice.channel;
    const channel = message.member.voice.channel;
    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening To ${me}**`);
    message.member.voice.channel.join();
    message.react('👋');
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'replay') {
    const que = await distube4.getQueue(message);
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening To ${me}**`);
    if (que) {
      distube4.stop(message);
      distube4.play(message, que.songs[0].url);
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});

client4.on('message', message => {
  if (message.channel.type === 'dm') return;
  if (!message.content.startsWith(prefix4)) return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command == 'youtube') {
    let channel = message.member.voice.channel;
    if (!channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
      method: 'POST',
      body: JSON.stringify({
        max_age: 86400,
        max_uses: 0,
        target_application_id: '755600276941176913',
        target_type: 2,
        temporary: false,
        validate: null
      }),
      headers: {
        Authorization: `Bot ${client4.token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(invite => {
        if (!invite.code)
          return message.reply(`**❌ Error I Can't Start YouTube Together**`);
        message.channel.send(
          `**✅ Done Click On The Link To Start YouTube Together\nhttps://discord.com/invite/${
          invite.code
          }**`
        );
      });
  }
});

client4.on('message', async message => {
  if (message.channel.type === 'dm') return;
  const args = message.content
    .slice(prefix4.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix4) !== 0) return;
  if (command === 'lyrics') {
    if (!message.member.voice.channel)
      return message.reply(`**❌ Error You're Not in Voice Channel**`);
    const channel = message.member.voice.channel;
    const me = message.guild.me.voice.channel;

    if (me && me.id !== channel.id)
      return message.reply(`**❌ Error You Must Be Listening To ${me}**`);
    let que = await distube4.getQueue(message);
    if (que) {
      (async function(artist, title) {
        let lyrics = (await lyricsFinder(artist, title)) || 'Not Found!';
        message.channel
          .send(
            new Discord4.MessageEmbed()
              .setAuthor(
                client.user.tag,
                client.user.displayAvatarURL({
                  format: 'png',
                  size: 4096,
                  dynamic: true
                })
              )
              .setTitle(`**${que.songs[0].name} Lyrics**`)
              .setDescription(lyrics)
              .setColor(color)
              .setFooter(
                'Requested By ' + message.author.tag,
                message.author.displayAvatarURL({
                  format: 'png',
                  size: 4096,
                  dynamic: true
                })
              )
          )
          .catch(error => {
            message.channel.send(
              `**❌ Error The Song Characters More Than 200**`
            );
          });
      })(que.songs[0].name, '');
    } else if (!que) {
      message.reply(`**❌ Error No Music Has Been Playing**`);
      return;
    }
  }
});
// Music Cmds

// Music Src
distube4
  .on('playSong', async (message, queue, song) => {
    var embed = new Discord4.MessageEmbed()
      .setTitle('**' + song.name + '**')
      .setURL(song.url)
      .addField(
        '**Published By :**',
        `**[${song.info.videoDetails.ownerChannelName}](${
        song.info.videoDetails.ownerProfileUrl
        })**`
      )
      .addField('**Views :**', `**${song.views}**`)
      .addField('**Duration :**', `**${song.formattedDuration}**`)
      .addField('**Played By :**', `**${song.user}**`)
      .setImage(`${song.thumbnail}`)
      .setFooter(
        `👍 ${song.likes} | 👎 ${song.dislikes}`,
        song.user.avatarURL({
          format: 'png',
          size: 4096,
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor(color);
    message.channel.send(embed);
    client4.channels.cache.get('854265212499394560').send(embed);
  })
  .on('addSong', async (message, queue, song) => {
    var embed = new Discord4.MessageEmbed()
      .setTitle('**' + song.name + '**')
      .setURL(song.url)
      .addField(
        '**Published By :**',
        `**[${song.info.videoDetails.ownerChannelName}](${
        song.info.videoDetails.ownerProfileUrl
        })**`
      )
      .addField('**Views :**', `**${song.views}**`)
      .addField('**Duration :**', `**${song.formattedDuration}**`)
      .addField('**Added By :**', `**${song.user}**`)
      .setImage(`${song.thumbnail}`)
      .setFooter(
        `👍 ${song.likes} | 👎 ${song.dislikes}`,
        song.user.avatarURL({
          format: 'png',
          size: 4096,
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor(color);
    message.channel.send(embed);
    client4.channels.cache.get('854265212499394560').send(embed);
  })

  .on('playList', async (message, queue, playlist, song) => {
    var embed = new Discord4.MessageEmbed()
      .setTitle('**' + playlist.name + '**')
      .setURL(playlist.url)
      .addField('**Music Count :**', `**${playlist.songs.length}**`)
      .addField('**Played By :**', `**${playlist.user}**`)
      .setImage(`${playlist.thumbnail.url}`)
      .setFooter(
        playlist.user.tag,
        playlist.user.avatarURL({
          format: 'png',
          size: 4096,
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor(color);
    message.channel.send(embed);
    client4.channels.cache.get('854265212499394560').send(embed);
  })

  .on('addList', async (message, queue, playlist) => {
    var embed = new Discord4.MessageEmbed()
      .setTitle('**' + playlist.name + '**')
      .setURL(playlist.url)
      .addField('**Music Count :**', `**${playlist.songs.length}**`)
      .addField('**Added By :**', `**${playlist.user}**`)
      .setImage(`${playlist.thumbnail.url}`)
      .setFooter(
        playlist.user.tag,
        playlist.user.avatarURL({
          format: 'png',
          size: 4096,
          dynamic: true
        })
      )
      .setTimestamp()
      .setColor(color);
    message.channel.send(embed);
    client4.channels.cache.get('854265212499394560').send(embed);
  })
  .on('searchResult', async (message, result) => {
    var color = db.get(`co_${message.guild.id}`);
    if (color === null) color = cc;
    let i = 0;
    message.channel.send(
      new Discord4.MessageEmbed()
        .setTitle(`**🎵 Please Put a Number**`)
        .setDescription(
          `**${result
            .map(
              song =>
                `${++i} - [${song.name}](${song.url}) - \`${
                song.formattedDuration
                }\``
            )
            .join('\n')}**`
        )
        .setColor(color)
        .setThumbnail(
          message.guild.iconURL({
            format: 'png',
            size: 4096,
            dynamic: true
          })
        )
        .setFooter(
          `You Have 60s To Put a Number`,
          message.author.displayAvatarURL({
            format: 'png',
            size: 4096,
            dynamic: true
          })
        )
        .setTimestamp()
    );
  })
  .on('searchCancel', message =>
    message.channel.send(`**❗ Searching Has Been Stop**`)
  )
  .on('error', (message, e) => {
    console.error(e);
  })
  .on('initQueue', queue => {
    queue.autoplay = false;
    queue.volume = 100;
  });

client4.on("message", message => {
  var prefix = prefix4;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;
  if (command === "help") {
    const embed = new Discord3.MessageEmbed()
      .addField("**🎵 Music Commands :**", `\`${prefix}play\n${prefix}replay\n${prefix}stop\n${prefix}skip\n${prefix}skipto\n${prefix}loop\n${prefix}volume\n${prefix}seek\n${prefix}pause\n${prefix}resume\n${prefix}shuffle\n${prefix}queue\n${prefix}np\n${prefix}lyrics\n${prefix}join\n${prefix}disconnect\n${prefix}youtube\``, true)
      .addField("**🎧 Music Filters :**", `\`${prefix}3d\n${prefix}bassboost\n${prefix}echo\n${prefix}karaoke\n${prefix}nightcore\n${prefix}vaporwave\n${prefix}flanger\n${prefix}gate\n${prefix}haas\n${prefix}reverse\n${prefix}surround\n${prefix}mcompand\n${prefix}phaser\n${prefix}tremolo\n${prefix}earwax\``, true)
      .setColor(color)
      .setAuthor(client3.user.tag, client3.user.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setFooter(message.author.tag, message.author.displayAvatarURL({
        format: "png",
        size: 4096,
        dynamic: true
      }))
      .setTimestamp()
    message.channel.send(embed)
  }
})

client4.login(process.env.token4);
client3.login(process.env.token3);
client2.login(process.env.token2);
client.login(process.env.token);
