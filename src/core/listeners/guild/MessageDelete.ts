import { Listener } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";

export default class MessageDeleteListener extends Listener {
  public constructor() {
    super("messageDelete", {
      emitter: "client",
      event: "messageDelete",
    });
  }

  public async exec(message: Message) {
    if (message.author.bot || !message.guild) return;
    const snipes = this.client.snipes.get(message.channel.id) ?? [];
    snipes.push({
      author: message.author.id,
      content: message.content,
      attachments: message.attachments.size ? message.attachments : undefined,
    });
    this.client.snipes.set(message.channel.id, snipes);

    const channel = message.guild.channels.resolve(
      this.client.db.get(message.guild.id, "config.audit.log", null)
    );
    if (!channel || (channel && channel.type !== "text")) return;

    const allowedEvents = this.client.db.get(
      message.guild.id,
      "config.audit.events",
      []
    );
    if (!allowedEvents.includes("delete")) return;

    await (channel as TextChannel).send(
      new MessageEmbed()
        .setColor("#e33529")
        .setAuthor(
          `Message Delete | ${message.author.username}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          message.content.length > 1950
            ? `${message.content.substring(0, 1950)}...`
            : message.content || ""
        )
        .addField(
          `Author`,
          `${message.author} | (\`${message.author.id}\`)`,
          true
        )
        .addField(
          `Channel`,
          `${message.channel} | (\`${message.channel.id}\`)`,
          true
        )
        .setImage(
          message.attachments.size
            ? message.attachments.first().proxyURL
            : undefined
        )
    );
  }
}
