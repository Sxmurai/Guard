import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class PingCommand extends Command {
  public constructor() {
    super("ping", {
      aliases: ["ping", "latency"],
      description: {
        content: "Displays the bots latency",
      },
      typing: true,
    });
  }

  public exec(message: Message) {
    const date = Date.now();

    return new Promise((resolve) => {
      (this.client["api"] as any).channels[message.channel.id].typing
        .post()
        .then(() => {
          resolve(
            message.util.send(
              new MessageEmbed()
                .setColor("#e33529")
                .setDescription(
                  [
                    `**💓 • Shard Heatbeat: \`${this.client.ws.ping}MS\`**`,
                    `**🔂 • Discord Roundtrip: \`${Date.now() - date}MS\`**`,
                  ].join("\n")
                )
                .setFooter("")
            )
          );
        });
    });
  }
}
