import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class RepeatCommand extends Command {
  public constructor() {
    super("repeat", {
      aliases: ["repeat", "loop"],
      args: [
        {
          id: "type",
          type: [["track", "song"], "queue"],
          default: "track",
        },
      ],
      description: {
        content: "Repeats the queue or track",
        usage: "repeat <track, song|queue>",
        examples: ["repeat", "repeat queue", "repeat song", "repeat track"],
      },
      channel: "guild",
    });
  }

  public async exec(message: Message, { type }: { type: "track" | "queue" }) {
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

    player.queue.repeat[type] = !player.queue.repeat[type];
    const opposite = type === "queue" ? "track" : "queue";
    player.queue.repeat[opposite] = player.queue.repeat[opposite] = false;

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(
          `${
            player.queue.repeat[type] === true ? "Started" : "Stopped"
          } repeating the ${
            type === "track" ? "currently playing track" : "current queue"
          }.`
        )
    );
  }
}
