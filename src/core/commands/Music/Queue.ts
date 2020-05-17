import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import { Rest } from "../../../library/managers";

export default class QueueComand extends Command {
  public constructor() {
    super("queue", {
      aliases: ["queue", "q", "songs", "tracks"],
      args: [
        {
          id: "page",
          type: "number",
          default: 1,
        },
      ],
      description: {
        content: "Displays the queue",
        usage: "queue <page>",
        examples: ["queue", "queue 2"],
      },
      channel: "guild",
    });
  }

  public async exec(message: Message, { page }: { page: number }) {
    const player = this.client.manager.players.get(message.guild.id);
    if (!player || (player && !player.queue.queue.length))
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`There is nothing to show for the queue.`)
      );

    const itemsPerPage = 10;
    const maxPages = Math.ceil(player.queue.queue.length / itemsPerPage);

    const items = await Promise.all(
      player.queue.queue.slice(0, 1).map(async (track, index) => {
        const { title, uri } = await Rest.decode(
          track.track,
          config.get("nodes")[0]
        );

        return {
          title,
          uri,
          rank: index + 1,
        };
      })
    );

    const display = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const embed = new MessageEmbed()
      .setColor("#e33529")
      .setAuthor(
        `Queue | ${message.guild.name}`,
        message.guild.iconURL({ dynamic: true })
      )
      .addField(
        `Now Playing:`,
        `[${
          (
            await Rest.decode(
              player.queue.queue[0].track,
              config.get("nodes")[0]
            )
          ).title
        }](${
          (
            await Rest.decode(
              player.queue.queue[0].track,
              config.get("nodes")[0]
            )
          ).uri
        })`
      );

    if (player.queue.queue.length > 1)
      embed.setDescription(
        display
          .map((value) => `\`#${value.rank}\` | [${value.title}](${value.uri})`)
          .join("\n")
      );

    if (maxPages > 1) embed.setFooter(`Page: ${page} / ${maxPages}`);

    return message.util.send(embed);
  }
}
