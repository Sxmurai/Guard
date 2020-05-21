import { Command } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";

export default class StarboardCommand extends Command {
  public constructor() {
    super("starboard-set-channel", {
      category: "flag",
      args: [
        {
          id: "channel",
          type: "textChannel",
          prompt: {
            start: "Please provide a text channel",
            retry:
              "That channel was either not valid, or was not a text channel",
          },
        },
      ],
    });
  }

  public exec(message: Message, { channel }: { channel: TextChannel }) {
    const currentStarboardChannel = this.client.db.get(
      message.guild.id,
      "config.starboard.channel",
      undefined
    );
    if (currentStarboardChannel === channel.id)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `You cannot change the starboard channel to the one it is already..`
          )
      );

    this.client.db.set(
      message.guild.id,
      "config.starboard.channel",
      channel.id
    );

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(
          `Successfully ${
            currentStarboardChannel ? "set" : "changed"
          } the starboard channel to: ${channel}`
        )
    );
  }
}
