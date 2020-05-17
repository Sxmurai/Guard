import { Command, Argument } from "discord-akairo";
import { Message, MessageEmbed, Collection } from "discord.js";

import { Rest, Queue } from "../../../library/managers";

export default class PlayCommand extends Command {
  public constructor() {
    super("play", {
      aliases: ["play", "p"],
      args: [
        {
          id: "track",
          match: "rest",
          type: Argument.compose("string", (_, str) =>
            str.replace(/<(.+)>/g, "$1")
          ),
          prompt: {
            start: "Please provide a track name/url",
          },
        },

        {
          id: "type",
          type: ["youtube", "soundcloud"],
          default: "youtube",
          match: "option",
          flag: ["-type=", "-t=", "--type=", "--t="],
        },
      ],
      description: {
        content: "Plays music in your voice channel",
        usage: "play [track] <type>",
        examples: ["play Josh A - So Tired", "play Pacman -type=soundcloud"],
        flags: ["-type=", "-t=", "--type=", "--t="],
      },
      channel: "guild",
    });
  }

  public async exec(
    message: Message,
    { track, type }: { track: string; type: string }
  ) {
    const { channel } = message.member.voice;
    if (!channel)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`Please join a voice channel.`)
      );

    if (!channel.joinable)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`That voice channel is not joinable`)
      );

    const missingPerms = channel
      .permissionsFor(message.guild.me)
      .missing(["CONNECT", "SPEAK", "USE_VAD"]);
    if (missingPerms.length)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `I am missing the permission${
              missingPerms.length > 1 ? "s" : ""
            }: ${this.missingPermissions(missingPerms)}`
          )
      );

    let player = this.client.manager.players.get(message.guild.id);
    if (player && message.guild.me.voice.channelID !== channel.id)
      return message.util.send(
        new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`Please join my voice channel.`)
      );

    if (!player)
      player = await this.client.manager.join(
        {
          guild: message.guild.id,
          channel: channel.id,
        },
        { deaf: true }
      );

    if (!player.queue) player.queue = new Queue(player);

    const songs = await Rest.search(
      ["https", "http"].includes(track)
        ? track
        : `${type === "youtube" ? "ytsearch" : "scsearch"}:${track}`,
      config.get("nodes")[0]
    );

    switch (songs.loadType) {
      case "LOAD_FAILED":
      case "NO_MATCHES":
        return message.util.send(
          new MessageEmbed()
            .setColor("#e33529")
            .setDescription(`There was nothing found for that query`)
        );

        break;

      case "PLAYLIST_LOADED":
        songs.tracks.forEach((track) =>
          player.queue.add(track.track, message.author.id)
        );

        message.util.send(
          new MessageEmbed()
            .setColor("#e33529")
            .setThumbnail(
              `https://i.ytimg.com/vi/${songs.tracks[0].info.identifier}/hqdefault.jpg`
            )
            .setDescription(
              `Playlist Enqueued - (\`${songs.tracks.length} Trakcs\`)\n\n${songs.playlistInfo.name}`
            )
        );

        if (!player.paused && !player.playing)
          await player.queue.start(message);

        break;

      case "SEARCH_RESULT":
        const tracks = songs.tracks.slice(0, 5);

        const msg = await message.util.send(
          new MessageEmbed()
            .setColor("#e33529")
            .setDescription(
              tracks
                .map(
                  (track, index) =>
                    `\`#${index + 1}\` | [${track.info.title}](${
                      track.info.uri
                    })`
                )
                .join("\n")
            )
            .setFooter(`Pick a number from 1 - ${tracks.length}`)
        );

        const filter = (msg: Message) => msg.author.id === message.author.id;

        msg.channel
          .awaitMessages(filter, { time: 3e4, errors: ["time"], max: 1 })
          .then(async (collected: Collection<string, Message>) => {
            const first = collected.first();

            if (
              !this.handler.resolver.type("number")(msg, first.content) ||
              Number(first.content) > 5 ||
              Number(first.content) < 1
            )
              return message.util.send(
                new MessageEmbed()
                  .setColor("#e33529")
                  .setDescription(`A correct number would be nice..`)
              );

            if (first.content.toLowerCase() === "cancel")
              return message.util.send(
                new MessageEmbed()
                  .setColor("#e33529")
                  .setDescription(`Cancelled the selection.`)
              );

            if (first.deletable)
              await first.delete({ reason: "Selected track over" });

            message.util.send(
              new MessageEmbed()
                .setColor("#e33529")
                .setThumbnail(
                  `https://i.ytimg.com/vi/${songs.tracks[0].info.identifier}/hqdefault.jpg`
                )
                .setDescription(
                  `Track Enqueued\n\n[${songs.tracks[0].info.title}](${songs.tracks[0].info.uri})`
                )
            );

            player.queue.add(tracks[0].track, msg.author.id);

            if (!player.paused && !player.playing)
              await player.queue.start(msg);
          })
          .catch(() => {
            return message.util.send(
              new MessageEmbed()
                .setColor("#e33529")
                .setDescription(`Cancelled selection.`)
            );
          });
        break;

      case "TRACK_LOADED":
        player.queue.add(songs.tracks[0].track, message.author.id);

        message.util.send(
          new MessageEmbed()
            .setColor("#e33529")
            .setThumbnail(
              `https://i.ytimg.com/vi/${songs.tracks[0].info.identifier}/hqdefault.jpg`
            )
            .setDescription(
              `Track Enqueued\n\n[${songs.tracks[0].info.title}](${songs.tracks[0].info.uri})`
            )
        );

        if (!player.paused && !player.playing)
          await player.queue.start(message);

        break;
    }
  }

  public missingPermissions(permissions: string[]) {
    const result = permissions.map(
      (str) =>
        `\`${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, (char) => char.toUpperCase())}\``
    );

    return result.length > 1
      ? `${result.slice(0, -1).join(", ")} and ${result.slice(-1)[0]}`
      : result[0];
  }
}
