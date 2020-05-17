import { Listener } from "discord-akairo";

export default class InitializedListener extends Listener {
  public constructor() {
    super("initialized", {
      emitter: "settings",
      event: "initialized",
    });
  }

  public exec() {
    this.client.logger.info(`SettingsProvider has been initialized.`);
  }
}
