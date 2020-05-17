import { Message, MessageEmbed } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { EventEmitter } from "events";
import { Util } from "../structures";
import { Player } from "lavaclient";
import { Rest } from ".";

interface QueueOptions {
  track: string;
  user: string;
}

interface Repeat {
  track: boolean;
  queue: boolean;
}

export default class Queue extends EventEmitter {
  public queue: QueueOptions[] = [];
  private old: QueueOptions[] = [];
  public repeat: Repeat = { track: false, queue: false };

  public message: Message;

  public constructor(public player: Player) {
    super();

    player
      .on("end", async (evt) => {
        if (evt && ["REPLACED", "STOPPED"].includes(evt.reason)) return;

        const oldTrack = this.queue.shift();

        if (this.repeat.queue) this.old.push(oldTrack);
        else if (this.repeat.track) this.queue.unshift(oldTrack);

        if (this.message.guild.me.voice.channel.members.size === 1) {
          this.clean();
          (this.message.client as AkairoClient).manager.leave(
            this.message.guild.id
          );

          await player.destroy();

          return this.message.channel.send(
            new MessageEmbed()
              .setColor("#e33529")
              .setDescription(
                `Since I was abandonded in the voice channel, I cleared the queue.`
              )
          );
        }

        if (!this.queue.length) return this.emit("ended");
        await player.play(this.queue[0].track);
      })
      .on("start", async (track) => {
        const { title, uri, identifier, author, length } = await Rest.decode(
          track,
          config.get("nodes")[0]
        );

        this.message.channel.send(
          new MessageEmbed()
            .setColor("#e33529")
            .setThumbnail(`https://i.ytimg.com/vi/${identifier}/hqdefault.jpg`)
            .setDescription(
              `${author}\n\n[${title}](${uri}) [\`${Util.formatTime(
                length
              )}\`]\n`
            )
        );
      });

    this.on("ended", async () => {
      if (this.repeat.queue) {
        this.old.forEach((track) => this.add(track.track, track.user));
        return this.start(this.message);
      }

      this.clean();
      (this.message.client as AkairoClient).manager.leave(
        this.message.guild.id
      );
      await player.destroy();

      return this.message.channel.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`The queue has concluded, goodbye! :wave:`)
      );
    });
  }

  public async add(track: string, user: string) {
    return this.queue.push({ track, user });
  }

  public async start(message: Message) {
    this.message = message;
    if (!this.queue[0]) this.queue.shift();
    await this.player.play(this.queue[0].track);
  }

  public clean() {
    this.queue = [];
    this.old = [];
    this.repeat = { track: false, queue: false };
  }
}
