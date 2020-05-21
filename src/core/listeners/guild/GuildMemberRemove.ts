import { Listener } from "discord-akairo";
import { GuildMember, TextChannel } from "discord.js";

export default class GuildMemberRemoveListener extends Listener {
  public constructor() {
    super("guildMemberRemove", {
      emitter: "client",
      event: "guildMemberRemove",
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
        `<:pileave:672908113195696139> | Member Left\n${member.user.tag} (\`${
          member.id
        }\`)\nJoined Server: ${new Date(member.joinedAt).toLocaleDateString(
          "en-US",
          dateOptions
        )}`
      );
    }
  }
}
