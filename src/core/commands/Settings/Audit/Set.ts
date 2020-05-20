import { Command } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";

export default class AuditCommand extends Command {
  public constructor() {
    super("audit-set", {
      category: "flag",
      args: [
        {
          id: "channel",
          type: "textChannel",
          prompt: {
            start: "Please provide a text channel",
            retry:
              "That either isn't a valid channel, or it is not a Text Channel. Please try again.",
          },
        },
      ],
    });
  }

  public exec(message: Message, { channel }: { channel: TextChannel }) {
    const currentAuditChannel = this.client.db.get(
      message.guild.id,
      "config.audit.log",
      null
    );
    if (currentAuditChannel === channel.id)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `You cannot change the audit logs channel to the one it is already..`
          )
      );

    this.client.db.set(message.guild.id, "config.audit.log", channel.id);

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(
          `Successfully ${
            currentAuditChannel ? "set" : "changed"
          } the audit log channel to: ${channel}`
        )
    );
  }
}
