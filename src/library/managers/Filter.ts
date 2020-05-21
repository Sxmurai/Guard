import { AkairoClient } from "discord-akairo";
import { Message, TextChannel } from "discord.js";

export default class Filter {
  public static async wordFilter(message: Message) {
    if (!message.guild) return;
    if (message.member.permissions.has("MANAGE_MESSAGES")) return;

    const words = (message.client as AkairoClient).db.get(
      message.guild,
      "moderation.words",
      []
    );

    if (
      message.content
        .split(" ")
        .some((word) => words.includes(word.replace(/\s+/gi, "")))
    )
      await message.delete({ reason: "Contained banned word" });
  }

  public static async links(message: Message) {
    const LINK_REGEX = /([a-z]+):\/\/([a-z]+.?[a-z]+)\/?/gi;

    if (!message.guild) return;
    if (message.member.permissions.has("MANAGE_MESSAGES")) return;

    const okayLinks = (message.client as AkairoClient).db.get(
      message.guild,
      "moderation.links.allowed",
      []
    );

    if (
      message.content
        .split(" ")
        .filter((word) => okayLinks.includes(word))
        .some((word) => word.match(LINK_REGEX))
    )
      await message.delete({ reason: "Contained Link" });
  }

  public static async antiSpam(message: Message) {
    if (!message.guild || message.author.bot) return;
    //if (message.member.permissions.has("MANAGE_MESSAGES")) return;

    const spam =
      (message.client as AkairoClient).spam.get(
        `${message.guild.id}-${message.author.id}`
      ) || 0;
    const mode: number = (message.client as AkairoClient).db.get(
      message.guild,
      "moderation.antispamLevel"
    );

    const modes = {
      5: 3000,
      4: 2500,
      3: 2000,
      2: 1500,
      1: 1000,
    };

    spam + 1;

    (message.client as AkairoClient).spam.set(
      `${message.guild.id}-${message.author.id}`,
      spam
    );

    setInterval(() => {
      (message.client as AkairoClient).spam.set(
        `${message.guild.id}-${message.author.id}`,
        0
      );
    }, modes[mode]);

    if (spam > 3) {
      (message.client as AkairoClient).spam.set(
        `${message.guild.id}-${message.author.id}`,
        0
      );
      await (message.channel as TextChannel).bulkDelete(3, true);
      return message.channel.send(`${message.author}, stop spamming!`);
    }
  }
}
