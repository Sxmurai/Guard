import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class StarboardCommand extends Command {
  public constructor() {
    super("starboard-delete-threshold", {
      category: "flag",
    });
  }

  public exec(message: Message) {
    const currentStarboardChannel = this.client.db.get(
      message.guild.id,
      "config.starboard.threshold",
      null
    );

    if (currentStarboardChannel === 1)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `Theres nothing to change, as the starboard threshold is at default`
          )
      );

    this.client.db.set(message.guild.id, "config.starboard.threshold", 1);

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(`Successfully reset the starboard threshold`)
    );
  }
}
