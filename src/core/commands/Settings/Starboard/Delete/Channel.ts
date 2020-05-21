import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class StarboardCommand extends Command {
  public constructor() {
    super("starboard-delete-channel", {
      category: "flag",
    });
  }

  public exec(message: Message) {
    const currentStarboardChannel = this.client.db.get(
      message.guild.id,
      "config.starboard.channel",
      null
    );

    if (currentStarboardChannel === null)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `Theres nothing to change, as theres no current starboard channel`
          )
      );

    this.client.db.delete(message.guild.id, "config.starboard.channel");

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(`Successfully reset the starboard channel`)
    );
  }
}
