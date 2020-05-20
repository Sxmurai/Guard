import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class AuditCommand extends Command {
  public constructor() {
    super("audit-current", {
      category: "flag",
    });
  }

  public async exec(message: Message) {
    const currentSettings: any = this.client.db.get(
      message.guild.id,
      "config.audit"
    );
    if (!currentSettings)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`There is nothing for the audit log settings..`)
      );

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setAuthor(
          `Audit Logs | ${message.guild.name}`,
          message.guild.iconURL({ dynamic: true })
        )
        .addField(
          `Channel`,
          currentSettings.log !== null ? `<#${currentSettings.log}>` : "Nothing"
        )
        .addField(
          `Events`,
          currentSettings.events && currentSettings.events.length
            ? currentSettings.events
                .map((evt: string) => `\`${evt}\``)
                .join(", ")
            : "Nothing"
        )
    );
  }
}
