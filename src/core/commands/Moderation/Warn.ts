import { Command } from "discord-akairo";
import { Message, MessageEmbed, GuildMember } from "discord.js";

export default class WarnCommand extends Command {
  public constructor() {
    super("warn", {
      aliases: ["warn", "w"],
      args: [
        {
          id: "member",
          type: "member",
          prompt: {
            start: "Please provide a member to warn",
            retry: "That isn't a valid member.. You must try again..",
          },
        },

        {
          id: "reason",
          match: "rest",
          default: "No resaon provided by warning moderator",
        },
      ],
      description: {
        content: "Warns a member in the guild",
        usage: "warn [member] <reason>",
        examples: [
          "warn @Gavin no",
          "warn 2D why tho",
          "warn b1nzy banning me for pinging you in the Discord API server",
        ],
      },
      channel: "guild",
      userPermissions: ["MANAGE_MESSAGES"],
    });
  }

  public async exec(
    message: Message,
    { member, reason }: { member: GuildMember; reason: string }
  ) {
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`Role hierarchy. You cannot warn this member.`)
      );

    if (!member.kickable)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `I cannot warn this member as they are higher than me.`
          )
      );

    await prisma.infractions.create({
      data: {
        id: message.guild.id,
        moderator: message.author.id,
        target: member.id,
        reason,
        type: "warn",
        duration: 0,
      },
    });

    const id = this.client.db.get(message.guild.id, "moderation.case", 1);
    this.client.db.set(message.guild.id, "moderation.case", id + 1);

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(`Case \`#${id}\` | Warned ${member} successfully.`)
    );
  }
}
