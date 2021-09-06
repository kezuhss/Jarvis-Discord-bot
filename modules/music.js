const { Util } = require("discord.js");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
module.exports = client => {
  client.handleVideo = async function handleVideo(
    video,
    msg,
    voiceChannel,
    playlist = false
  ) {
    const serverQueue = client.musicQueue.get(msg.guild.id);

    msg.react("✅");

    console.log(video.title);
    const song = {
      id: video.id,
      title: Util.escapeMarkdown(video.title),
      url: `https://www.youtube.com/watch?v=${video.id}`
    };

    let queue = new Discord.MessageEmbed()
      .setTitle(`**${song.title}**`)
      .setDescription("Song" + ` ${song.title} has been added to queue`)
      .setColor("#00f2ff");

    if (!serverQueue) {
      const queueConstruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 4,
        playing: true
      };
      client.musicQueue.set(msg.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(msg.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`I could not join the voice channel: ${error}`);
        client.musicQueue.delete(msg.guild.id);
        return msg.channel.send(`I could not join the voice channel: ${error}`);
      }
    } else {
      serverQueue.songs.push(song);
      console.log(serverQueue.songs);
      if (playlist) return undefined;
      else return msg.channel.send(queue);
    }
    return undefined;
  };

  function play(guild, song) {
    const serverQueue = client.musicQueue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      client.musicQueue.delete(guild.id);
      return;
    }
    console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection
      .playStream(
        ytdl(
          song.url, {filter: "audioonly", quality: "highestaudio" , highWaterMark: 1024 * 1024 * 10  }
        )
      )
      .on("end", reason => {
        setTimeout(() => {
          if (reason === "Stream is not generating quickly enough.")
            console.log("Song ended.");
          else console.log(reason);
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
        }, 100);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    let playing = new Discord.MessageEmbed()
      .setTitle("NOW PLAYING")
      .setDescription("🎶 Playing" + ` **${song.title}**`)
      .setColor("#00f2ff");

    serverQueue.textChannel.send(playing);
  }
};
