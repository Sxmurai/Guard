import { Starboard } from "../../../library/managers";
import { MessageReaction, User } from "discord.js";
import { Listener } from "discord-akairo";

export default class MessageReactionRemove extends Listener {
  public constructor() {
    super("messageReactionRemove", {
      emitter: "client",
      event: "messageReactionRemove"
    });
  }

  public async exec(reaction: MessageReaction, user: User) {
    if (reaction.partial) await reaction.fetch();
    await Starboard.remove(reaction, user, this.client);
  }
}