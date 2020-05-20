import { Command, Flag } from "discord-akairo";

export default class AuditCommand extends Command {
  public constructor() {
    super("audit-events", {
      category: "flag",
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["audit-events-enable", "enable"],
        ["audit-events-disable", "disable", "del", "delete", "rm", "remove"],
      ],
      default: "audit-current",
    };

    return Flag.continue(method);
  }
}
