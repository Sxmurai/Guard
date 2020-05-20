import { Command, Flag } from "discord-akairo";

export default class AuditCommand extends Command {
  public constructor() {
    super("audit", {
      aliases: ["audit", "auditlogs"],
      description: {
        content: "Configures the audit log functionality for Gaurd.",
        usage: "audit <method> <[args]>",
        examples: [
          "audit set #audit-logs",
          "audit reset",
          "audit events enable delete, edit, music",
          "audit events disable music",
        ],
        "Extended Usage":
          "audit <set|del, delete, rm, remove, reset|events, evts|current, curr> <[args]>",
      },
      userPermissions: ["MANAGE_GUILD"],
      channel: "guild",
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["audit-set", "set"],
        ["audit-reset", "reset", "del", "delete", "rm", "remove"],
        ["audit-events", "events", "evts"],
        ["audit-current", "current", "curr"],
      ],
      default: "audit-current",
    };

    return Flag.continue(method);
  }
}
