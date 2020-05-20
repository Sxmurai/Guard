import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class AuditCommand extends Command {
  public constructor() {
    super("audit-reset", {
      category: "flag",
    });
  }

  public exec(message: Message) {
    const currentAuditChannel = this.client.db.get(
      message.guild.id,
      "config.audit.log",
      null
    );

    if (currentAuditChannel === null)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `Theres nothing to change, as theres no current audit log channel`
          )
      );

    this.client.db.delete(message.guild.id, "config.audit.log");

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(`Successfully reset the audit log channel`)
    );
  }
}
