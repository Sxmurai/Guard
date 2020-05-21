import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class StarboardCommand extends Command {
  public constructor() {
    super("starboard-all", {
      category: "flag",
    });
  }

  public exec(message: Message) {
    const data: any = this.client.db.get(message.guild.id, "config.starboard");
    if (!data)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`There is nothing for the starboard settings..`)
      );

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setAuthor(
          `Starboard Settings | ${message.guild.name}`,
          message.guild.iconURL({ dynamic: true })
        )
        .addField(
          `Channel`,
          data.channel === null ? "None" : `<#${data.channel}>`
        )
        .addField(`Threshold`, data.threshold ?? 1)
    );
  }
}
