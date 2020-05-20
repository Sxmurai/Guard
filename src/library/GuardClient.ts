import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";
import { SettingsProvider } from "./database/SettingsProvider";
import { Configuration, APIManager } from "./structures";
import { PrismaClient } from "@prisma/client";
import { Player, Manager } from "lavaclient";
import { MessageEmbed } from "discord.js";
import Logger from "@ayanaware/logger";
import { Queue } from "./managers";
import { join } from "path";

declare module "discord-akairo" {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    inhibitorHandler: InhibitorHandler;
    manager: Manager;
    db: SettingsProvider;
    logger: Logger;
    apis: APIManager;
    snipes: Map<string, any[]>;
  }
}

declare module "lavaclient" {
  interface Player {
    queue: Queue;
  }
}

declare global {
  const config: Configuration;
  const prisma: PrismaClient;
}

interface GuardOptions {
  token: string;
  owners: string[];
  prefix: string;
}

export default class GuardClient extends AkairoClient {
  public db: SettingsProvider = new SettingsProvider();
  public logger: Logger = Logger.get(GuardClient);
  public apis: APIManager = new APIManager(this, join("build", "core", "apis"));
  public snipes: Map<string, any[]> = new Map();

  public manager: Manager = new Manager(config.get("nodes"), {
    shards: this.shard ? this.shard.count : 1,
    send: (id, payload) => {
      const guild = this.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
      return;
    },
  });

  public constructor(public configuration: GuardOptions) {
    super({
      disableMentions: "everyone",
      ownerID: configuration.owners,
    });
  }

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: join("build", "core", "commands"),
    prefix: (msg) =>
      msg.guild
        ? this.db.get(msg.guild.id, "config.prefix", this.configuration.prefix)
        : this.configuration.prefix,
    allowMention: true,
    aliasReplacement: /-/g,
    handleEdits: true,
    commandUtil: true,
    argumentDefaults: {
      prompt: {
        modifyStart: (_, str: string) =>
          new MessageEmbed()
            .setColor("#e33529")
            .setDescription(
              `${str}\n\nType: \`cancel\` to cancel the command..`
            ),
        modifyRetry: (_, str: string) =>
          new MessageEmbed()
            .setColor("#e33529")
            .setDescription(
              `${str}\n\nType: \`cancel\` to cancel the command..`
            ),
        cancel: new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`Cancelled the command.`),
        ended: new MessageEmbed()
          .setColor("#e33529")
          .setDescription(
            `Oops, that was one too many tries. I have to cancel the command now.`
          ),
        timeout: new MessageEmbed()
          .setColor("#e33529")
          .setDescription(`Well, times up. I have to cancel the command now.`),
        time: 3e4,
        retries: 3,
      },
      otherwise: "",
    },
    automateCategories: true,
    defaultCooldown: 15e3,
  });

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: join("build", "core", "listeners"),
  });

  public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: join("build", "core", "inhibitors"),
  });

  private async init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      inhibitorHandler: this.inhibitorHandler,
      lavaclient: this.manager,
      websocket: this.ws,
      settings: this.db,
      process,
    });

    await this.db.init();
    await this.manager.init(config.get("bot.id"));

    this.apis.loadAll();

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
    //this.inhibitorHandler.loadAll();
  }

  public async start(): Promise<string> {
    await this.init();
    return super.login(this.configuration.token);
  }
}
