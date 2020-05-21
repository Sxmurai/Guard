import { Command, Flag } from "discord-akairo";

export default class StarboardCommand extends Command {
  public constructor() {
    super("starboard", {
      aliases: ["starboard"],
      description: {
        content: "Changes the starboard configuration",
        usage:
          "starboard <set|delete, del, rm, remove, reset|all, current, curr> <[args]>",
        examples: [
          "starboard set channel #starboard",
          "starboard reset channel",
          "starboard set threshold 2",
          "starboard reset threshold",
          "starboard all",
        ],
      },
      userPermissions: ["MANAGE_MESSAGES"],
      channel: "guild",
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["starboard-set", "set"],
        ["starboard-delete", "delete", "del", "rm", "remove", "reset"],
        ["starboard-all", "all", "current", "curr"],
      ],
      default: "starboard-all",
    };

    return Flag.continue(method);
  }
}
