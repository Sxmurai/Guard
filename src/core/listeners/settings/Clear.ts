import { Listener } from "discord-akairo";
import { Guild } from "discord.js";

export default class ClearListener extends Listener {
  public constructor() {
    super("clear", {
      emitter: "settings",
      event: "clear",
    });
  }

  public exec(guild: string | Guild) {
    this.client.logger.info(
      `SettingsProvider#delete() - ${
        guild instanceof Guild
          ? guild.name
          : this.client.guilds.cache.get(guild).name
      } cleared the guild settings.`
    );
  }
}
