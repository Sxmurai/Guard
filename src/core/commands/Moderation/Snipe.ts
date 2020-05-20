import { Command } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";

export default class SnipeCommand extends Command {
  public constructor() {
    super("snipe", {
      aliases: ["snipe", "snipeum"],
      args: [
        {
          id: "channel",
          type: "textChannel",
          default: (msg: Message) => msg.channel,
          unordered: true,
        },

        {
          id: "position",
          type: "number",
          unordered: true,
          default: 1,
        },
      ],
      description: {
        content: "Gets the selected deleted message",
        usage: "snipe < channel > < position >",
        examples: ["snipe", "snipe #media", "snipe 2", "snipe #general 3"],
      },
      channel: "guild",
      userPermissions: ["MANAGE_NICKNAMES"],
    });
  }

  public async exec(
    message: Message,
    { channel, position }: { channel: TextChannel; position: number }
  ) {
    const msg: any = this.client.snipes.get(channel.id);
    if (!msg || !msg[position - 1] === undefined)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `There is no recently deleted messages for: ${channel.toString()}`
          )
      );

    const snipes = msg[position - 1];

    const embed = new MessageEmbed()
      .setColor("#e33529")
      .setAuthor(
        `${this.client.users.cache.get(snipes.author).tag} | #${channel.name}`,
        this.client.users.cache
          .get(snipes.author)
          .displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        snipes.content.length > 1950
          ? `${snipes.content.substr(0, 1950)}...`
          : snipes.content || ""
      );

    if (snipes.attachments)
      embed.setImage(
        snipes.attachments.size > 1 ? snipes.attachments[0] : snipes.attachments
      );

    return message.util.send({ embed });
  }
}
