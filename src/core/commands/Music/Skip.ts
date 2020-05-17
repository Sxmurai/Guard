import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class SkipCommand extends Command {
  public constructor() {
    super("skip", {
      aliases: ["skip", "next"],
      description: {
        content: "Skips the current track.",
      },
      channel: "guild",
      userPermissions: (msg: Message) => {
        if (msg.member.hasPermission("ADMINISTRATOR")) return null;
        if (
          msg.member.voice.channel &&
          msg.member.voice.channel.members.size === 2
        )
          return null;
        const djRole = this.client.db.get(msg.guild.id, "config.djRole", null);

        if (djRole && !msg.member.roles.cache.has(djRole)) return "DJ";
      },
    });
  }

  public exec(message: Message) {
    const player = this.client.manager.players.get(message.guild.id);
    if (!player || (player && !player.queue.queue.length))
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`There is nothing to show for the queue.`)
      );

    const { channel } = message.member.voice;
    if (!channel)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`Please join a voice channel.`)
      );

    if (message.guild.me.voice.channelID !== channel.id)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`Please join my voice channel.`)
      );

    if (player.paused)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`The track is paused!`)
      );

    player.emit("end");

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(`Skipped the next track.`)
    );
  }
}
