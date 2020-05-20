import { Command, Argument } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class VolumeCommand extends Command {
  public constructor() {
    super("volume", {
      aliases: ["volume", "vol", "setvolume", "setvol"],
      args: [
        {
          id: "volume",
          type: Argument.range("number", 1, 101),
          prompt: {
            start: "Please provide a volume",
            retry: "The number must be 1-100",
          },
        },
      ],
      description: {
        content: "Changes the volume of the player",
        usage: "volume [1-100]",
        examples: ["volume 20", "volume 1"],
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

  public async exec(message: Message, { volume }: { volume: number }) {
    const player = this.client.manager.players.get(message.guild.id);
    if (!player || (player && !player.queue.queue.length))
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `There is no queue running, or there is a player with no queue running`
          )
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

    await player.setVolume(volume);

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(`Set the volume to: \`${volume}/100\``)
    );
  }
}
