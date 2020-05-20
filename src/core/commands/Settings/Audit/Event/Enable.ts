import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

const evts = ["delete", "edit", "channel", "role", "music"];

export default class AuditCommand extends Command {
  public constructor() {
    super("audit-events-enable", {
      category: "flag",
      args: [
        {
          id: "events",
          type: "text",
          match: "rest",
          prompt: {
            start:
              "Please provide an event, or a list of events seperated by a `,`",
            retry: `The only valid events are: ${evts
              .map((evt) => `\`${evt}\``)
              .join(", ")}.`,
          },
        },
      ],
    });
  }

  public exec(message: Message, { events }: { events: string }) {
    if (
      events
        .toString()
        .replace(/\s+/g, "")
        .split(",")
        .some((e) => !evts.includes(e))
    )
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `There are events that are invalid. The valid events are: ${evts
              .map((evt) => `\`${evt}\``)
              .join(", ")}`
          )
      );

    const allWords: string[] = this.client.db.get(
      message.guild.id,
      "config.audit.events",
      []
    );

    const existingEvents = this.checkIfIexistsInArray(
      allWords,
      events.toString().replace(/\s+/g, "").split(",")
    );

    if (existingEvents !== null)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `The event${
              existingEvents.length > 1 ? "s" : ""
            }: ${existingEvents} are already enabled`
          )
      );

    this.client.db.set(
      message.guild.id,
      "config.audit.events",
      allWords.concat(...events.toString().replace(/\s+/g, "").split(","))
    );

    const newEvents = events
      .toString()
      .replace(/\s+/g, "")
      .split(",")
      .filter((e) => !allWords.includes(e));

    return message.util.send(
      new MessageEmbed()
        .setColor("#e33529")
        .setDescription(
          `Added the event${newEvents.length > 1 ? "s" : ""}: ${newEvents
            .map((e) => `\`${e}\``)
            .join(", ")}`
        )
    );
  }

  public checkIfIexistsInArray(arr: string[], existing: string[]) {
    const items = arr.filter((e) => existing.includes(e));

    return items.length ? items.map((e) => `\`${e}\``).join(", ") : null;
  }
}
