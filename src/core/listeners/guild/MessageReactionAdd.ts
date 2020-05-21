import { Starboard } from "../../../library/managers";
import { MessageReaction, User } from "discord.js";
import { Listener } from "discord-akairo";

export default class MessageReactionAddListener extends Listener {
  public constructor() {
    super("messageReactionAdd", {
      emitter: "client",
      event: "messageReactionAdd"
    });
  }

  public async exec(reaction: MessageReaction, user: User) {
    if (reaction.partial) await reaction.fetch();
    await Starboard.add(reaction, user, this.client);
  }
}