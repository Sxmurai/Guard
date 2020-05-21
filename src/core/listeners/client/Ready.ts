import { Listener } from "discord-akairo";

import { Guild } from "../../../library/managers";

export default class ReadyListener extends Listener {
  public constructor() {
    super("ready", {
      emitter: "client",
      event: "ready",
    });
  }

  public exec() {
    this.client.logger.info(
      `${this.client.user.username} is ready in ${this.client.guilds.cache.size} guilds!`
    );

    // setInterval(async () => {
    //   await new Guild().check(this.client);
    // }, 5e3);

    let activities = [
        `${config.get("bot.prefix")}help`,
        `${config.get("bot.prefix")}help | ${
          this.client.commandHandler.modules.size
        } commands`,
        `${config.get("bot.prefix")}help | ${
          this.client.guilds.cache.size
        } guilds`,
        `${config.get("bot.prefix")}help | ${
          this.client.users.cache.size
        } users`,
      ],
      i = 0;

    setInterval(() => {
      this.client.user.setActivity(activities[i++ % activities.length], {
        type: "WATCHING",
      });
    }, 3e4);
  }
}
