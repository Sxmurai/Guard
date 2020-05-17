import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class ServerinfoCommand extends Command {
  public constructor() {
    super("serverinfo", {
      aliases: ["serverinfo", "si", "guild", "server", "guildinfo"],
      description: {
        content: "Displays the guild's server information",
      },
      channel: "guild",
    });
  }

  public exec(message: Message) {
    const region: object = {
      brazil: ":flag_br: `Brazil`",
      "eu-central": ":flag_eu: `Central Europe`",
      singapore: ":flag_sg: `Singapore`",
      "us-central": ":flag_us: `U.S. Central`",
      sydney: ":flag_au: `Sydney`",
      "us-east": ":flag_us: `U.S. East`",
      "us-south": ":flag_us: `U.S. South`",
      "us-west": ":flag_us: `U.S. West`",
      "eu-west": ":flag_eu: `Western Europe`",
      "vip-us-east": ":flag_us: `VIP U.S. East`",
      london: ":flag_gb: `London`",
      amsterdam: ":flag_nl: `Amsterdam`",
      hongkong: ":flag_hk: `Hong Kong`",
      russia: ":flag_ru: `Russia`",
      southafrica: ":flag_za: `South Africa`",
      europe: ":flag_eu: `Europe`",
    };

    const dateOptions: object = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const embed = new MessageEmbed()
      .setAuthor(
        `Information | ${message.guild.name}`,
        message.guild.iconURL({ dynamic: true })
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setColor("#e33529")
      .addField(`ID`, `\`${message.guild.id}\``, true)
      .addField(`Region`, region[message.guild.region], true)
      .addField(`Owner`, `<@!${message.guild.ownerID}>`, true)
      .addField(
        `Created At`,
        `\`${new Date(message.guild.createdAt).toLocaleDateString(
          "en-US",
          dateOptions
        )}\``,
        true
      )
      .addField(`Tier`, `\`${message.guild.premiumTier} / 3\``, true)
      .addField(`Boosts`, `\`${message.guild.premiumSubscriptionCount}\``, true)
      .addField(
        `Presences`,
        Object.values(this.getMemberPresences(message))
          .map((v: any) => v)
          .join("\n"),
        true
      )
      .addField(
        `Text | Voice | Total`,
        `\`${this.getChannelSizes(message).text}, ${
          this.getChannelSizes(message).voice
        }, ${message.guild.channels.cache.size}\``,
        true
      )
      .addField(`Membercount`, `\`${message.guild.members.cache.size}\``, true)
      .addField(
        `Static Emojis (${
          message.guild.emojis.cache.filter((e) => !e.animated).size
        })`,
        message.guild.emojis.cache.size > 16
          ? `${message.guild.emojis.cache
              .filter((e) => !e.animated)
              .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
              .first(15)
              .map((e) => e)
              .join(", ")}...`
          : message.guild.emojis.cache
              .filter((e) => !e.animated)
              .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
              .first(15)
              .map((e) => e)
              .join(", ") || "None"
      )
      .addField(
        `Animated Emojis (${
          message.guild.emojis.cache.filter((e) => e.animated).size
        })`,
        message.guild.emojis.cache.size > 16
          ? `${message.guild.emojis.cache
              .filter((e) => e.animated)
              .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
              .first(15)
              .map((e) => e)
              .join(", ")}...`
          : message.guild.emojis.cache
              .filter((e) => e.animated)
              .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
              .first(15)
              .map((e) => e)
              .join(", ") || "None"
      )
      .addField(
        `Roles (${message.guild.roles.cache.size - 1})`,
        message.guild.roles.cache.size > 16
          ? `${message.guild.roles.cache
              .sort((a, b) => (b.position > a.position ? 1 : -1))
              .first(15)
              .slice(0, -1)
              .map((r) => r)
              .join(", ")}...`
          : message.guild.roles.cache
              .sort((a, b) => (b.position > a.position ? 1 : -1))
              .first(15)
              .slice(0, -1)
              .map((r) => r)
              .join(", ") || "None"
      );

    return message.util.send({ embed });
  }

  public getMemberPresences(message: Message) {
    let obj = {
      online: 0,
      idle: 0,
      dnd: 0,
      offline: 0,
    };

    for (const [, member] of message.guild.members.cache) {
      obj[member.presence.status]++;
    }

    return {
      online: `<:online:660283475223379988> \`${obj.online}\``,
      idle: `<:idle:660283475034636288> \`${obj.idle}\``,
      dnd: `<:dnd:660283474527387649> \`${obj.dnd}\``,
      offline: `<:offline:660283474783109125> \`${obj.offline}\``,
    };
  }

  public getChannelSizes(message: Message) {
    let obj = {
      voice: 0,
      text: 0,
    };

    for (const [, channel] of message.guild.channels.cache) {
      obj[channel.type]++;
    }

    return obj;
  }
}
