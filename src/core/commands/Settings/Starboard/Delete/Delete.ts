import { Command, Flag } from "discord-akairo";

export default class StarboardCommand extends Command {
  public constructor() {
    super("starboard-delete", {
      category: "flag",
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["starboard-delete-channel", "channel"],
        ["starboard-delete-threshold", "threshold"],
      ],
      default: "starboard-all",
    };

    return Flag.continue(method);
  }
}
