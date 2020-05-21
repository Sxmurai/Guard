import { Listener } from "discord-akairo";
import { GuildMember, TextChannel } from "discord.js";

export default class GuildMemberAddListener extends Listener {
  public constructor() {
    super("guildMemberAdd", {
      emitter: "client",
      event: "guildMemberAdd",
    });
  }

  public async exec(member: GuildMember) {
    if (member.guild.id === "638036514214772737") {
      const channel = member.guild.channels.cache.get("640954640657285132");
      if (!channel) return;

      const dateOptions: object = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      await (channel as TextChannel).send(
        `<:pinew:672908113661132810> | Member Joined\n${member.user.tag} (\`${
          member.id
        }\`)\nAccount Created: ${new Date(
          member.user.createdAt
        ).toLocaleDateString("en-US", dateOptions)}`
      );
    }
  }
}
