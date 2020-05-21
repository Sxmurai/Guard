import { Listener } from "discord-akairo";
import { Message } from "discord.js";

import { Filter } from "../../../library/managers";

export default class MessageListener extends Listener {
  public constructor() {
    super("message", {
      emitter: "client",
      event: "message",
    });
  }

  public async exec(message: Message) {
    if (message.guild.id === "683074588493742091")
      await Filter.antiSpam(message);
  }
}
