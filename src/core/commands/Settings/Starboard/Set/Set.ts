import { Command, Flag } from "discord-akairo";

export default class StarboardCommand extends Command {
  public constructor() {
    super("starboard-set", {
      category: "flag",
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["starboard-set-channel", "channel"],
        ["starboard-set-threshold", "threshold"],
      ],
      default: "starboard-all",
    };

    return Flag.continue(method);
  }
}
