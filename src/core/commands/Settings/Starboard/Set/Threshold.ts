import { Command, Argument } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";

export default class StarboardCommand extends Command {
  public constructor() {
    super("starboard-set-threshold", {
      category: "flag",
      args: [
        {
          id: "threshold",
          type: Argument.range("number", 1, 11),
          prompt: {
            start: "Please choose a number from 1 to 10",
            retry: "You must provide a number from 1 to 10",
          },
        },
      ],
    });
  }

  public exec(message: Message, { threshold }: { threshold: number }) {
    const currentStarboardThreshold = this.client.db.get(
      message.guild.id,
      "config.starboard.threshold",
      1
    );
    if (currentStarboardThreshold === threshold)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `You cannot change the starboard threshold to the one it is already..`
          )
      );

    this.client.db.set(
      message.guild.id,
      "config.starboard.threshold",
      threshold
    );

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(
          `Successfully ${
            currentStarboardThreshold ? "set" : "changed"
          } the starboard threshold to: ${threshold}`
        )
    );
  }
}
