import { Listener } from "discord-akairo";
import { Guild } from "discord.js";

export default class DeleteListener extends Listener {
  public constructor() {
    super("delete", {
      emitter: "settings",
      event: "delete",
    });
  }

  public exec(guild: string | Guild, setting: string) {
    this.client.logger.info(
      `SettingsProvider#delete() - ${
        guild instanceof Guild
          ? guild.name
          : this.client.guilds.cache.get(guild).name
      } cleared the setting: ${setting}`
    );
  }
}
