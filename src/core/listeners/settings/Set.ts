import { Listener } from "discord-akairo";
import { Guild } from "discord.js";

export default class SetListener extends Listener {
  public constructor() {
    super("set", {
      emitter: "settings",
      event: "set",
    });
  }

  public exec(guild: string | Guild, setting: string, value: string) {
    this.client.logger.info(
      `SettingsProvider#set() - ${
        guild instanceof Guild
          ? guild.name
          : this.client.guilds.cache.get(guild).name
      } set setting: ${setting} with value: ${value}`
    );
  }
}
