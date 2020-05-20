import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

const evts = ["delete", "edit", "channel", "role", "music"];

export default class AuditCommand extends Command {
  public constructor() {
    super("audit-events-disable", {
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
            }: ${existingEvents} aren't even enabled`
          )
      );

    this.client.db.set(
      message.guild.id,
      "config.audit.events",
      events
        .toString()
        .replace(/\s+/g, "")
        .split(",")
        .forEach((word) => allWords.splice(allWords.indexOf(word, 1)))
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
          `Disabled the event${
            newEvents.length > 1 ? "s" : ""
          }: ${newEvents.map((e) => `\`${e}\``).join(", ")}`
        )
    );
  }

  public checkIfIexistsInArray(arr: string[], existing: string[]) {
    const items = existing.filter((item) => !arr.includes(item));

    return items.length ? items.map((e) => `\`${e}\``).join(", ") : null;
  }
}
