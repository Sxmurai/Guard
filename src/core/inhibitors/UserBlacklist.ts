import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

export default class UserBlacklistInhibitor extends Inhibitor {
  public constructor() {
    super("userBlacklist", {
      reason: "userBlacklist",
    });
  }

  public exec(message: Message): boolean {
    return this.client.db
      .get("global", "blacklist.users", [])
      .map((data) => data.id)
      .includes(message.author.id);
  }
}
