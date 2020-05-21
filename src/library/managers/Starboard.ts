import {
  MessageReaction,
  User,
  TextChannel,
  Message,
  MessageEmbed,
} from "discord.js";
import { AkairoClient } from "discord-akairo";

export default class Starboard {
  public static async add(
    reaction: MessageReaction,
    user: User,
    client: AkairoClient
  ) {
    const { message } = reaction;
    if (message.author.bot || reaction.emoji.name !== "⭐") return;

    const threshold = client.db.get(
      message.guild,
      "config.starboard.threshold",
      1
    );
    if (reaction.message.reactions.cache.get("⭐").count < threshold) return;

    const starboardChannel = message.guild.channels.resolve(
      client.db.get(message.guild.id, "config.starboard.channel", null)
    );
    if (!starboardChannel || starboardChannel.type !== "text") return;

    const messages = await (starboardChannel as TextChannel).messages.fetch({
      limit: 100,
    });

    const stars = messages.find(
      (msg: Message) =>
        msg.embeds[0].author.name.includes("⭐") &&
        msg.embeds[0].author.url === message.url
    );

    if (!stars) {
      const image = message.attachments.size
        ? Starboard.extension(message.attachments.array()[0].url)
        : undefined;

      if (!image && !message.content.length) return;

      await (starboardChannel as TextChannel).send(
        Starboard.starboardEmbed()
          .setImage(image)
          .setAuthor(
            `⭐ ${reaction.message.reactions.cache.get("⭐").count} | ${
              message.author.tag
            }`,
            message.author.displayAvatarURL({ dynamic: true }),
            message.url
          )
          .setDescription(
            message.content.length > 1950
              ? `${message.content.substring(0, 1950)}...`
              : message.content
          )
      );
    } else {
      const image = message.attachments.size
        ? Starboard.extension(message.attachments.array()[0].url)
        : undefined;

      const star = /([0-9]{1,3})/.exec(stars.embeds[0].author.name);
      if (!image && !message.content.length) return;

      const starMessage = await (starboardChannel as TextChannel).messages.fetch(
        stars.id
      );

      const emebd = Starboard.starboardEmbed()
        .setAuthor(
          `⭐ ${parseInt(star[1]) + 1} | ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true }),
          message.url
        )
        .setImage(image)
        .setDescription(
          message.content.length > 1950
            ? `${message.content.substring(0, 1950)}...`
            : message.content
        );

      await starMessage.edit(emebd);
    }
  }

  public static async remove(
    reaction: MessageReaction,
    user: User,
    client: AkairoClient
  ) {
    const { message } = reaction;
    if (message.author.bot || reaction.emoji.name !== "⭐") return;

    const starboardChannel = message.guild.channels.resolve(
      client.db.get(message.guild.id, "config.starboard.channel", null)
    );
    if (!starboardChannel || starboardChannel.type !== "text") return;

    const messages = await (starboardChannel as TextChannel).messages.fetch({
      limit: 100,
    });

    const stars = messages.find(
      (msg: Message) =>
        msg.embeds[0].author.name.includes("⭐") &&
        msg.embeds[0].author.url === message.url
    );

    if (stars) {
      const image = message.attachments.size
        ? Starboard.extension(message.attachments.array()[0].url)
        : undefined;
      const star = /([0-9]{1,3})/.exec(stars.embeds[0].author.name);
      if (!image && !message.content.length) return;

      const starMessage = await (starboardChannel as TextChannel).messages.fetch(
        stars.id
      );

      const embed = Starboard.starboardEmbed()
        .setAuthor(
          `⭐ ${parseInt(star[1]) - 1} | ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true }),
          message.url
        )
        .setImage(image)
        .setDescription(
          message.content.length > 1950
            ? `${message.content.substring(0, 1950)}...`
            : message.content
        );

      await starMessage.edit(embed);
      if (parseInt(star[1]) - 1 <= 0)
        await starMessage.delete({ timeout: 2e3 });
    }
  }

  public static starboardEmbed() {
    return new MessageEmbed().setColor("#ebd234").setTimestamp(Date.now());
  }

  public static extension(attachment: string): string {
    const typeOfImage = attachment.split(".")[attachment.split(".").length - 1];
    const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);

    return image ? attachment : undefined;
  }
}
