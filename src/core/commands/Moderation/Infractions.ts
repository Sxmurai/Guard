import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class InfractionsCommand extends Command {
  public constructor() {
    super("infractions", {
      aliases: ["infractions"],
      description: {
        content: "Displays the infractions on a member in the guild",
        usage: "infractions <all|member|delete, del, rm, remove|reason, edit> <[arguments]>",
        examples: [
          "infractions all",
          "infractions member @Gavin",
          "infractions delete 4",
          "infractions edit 4 Void Infraction"
        ]
      },
      userPermissions: ["MANAGE_GUILD"],
      channel: "guild"
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["infractions-all", "all"],
        ["infractions-member", "member"],
        ["infractions-delete", "del", "rm", "remove"],
        ["infractions-reason", "reason", "edit"]
      ],

      otherwise: (msg: Message) => {
        //@ts-ignore
        const prefix = this.handler.prefix(msg);

        return `Please run the \`${prefix}help infractions\` command to figure out the correct usage to use the command!`
      }
    }

    return Flag.continue(method);
  }
}