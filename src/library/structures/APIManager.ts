import { Collection } from "discord.js";
import { AkairoClient } from "discord-akairo";
import { readdirSync, lstatSync } from "fs";
import { join } from "path";

export default class APIManager extends Collection<string, any> {
  public constructor(public client: AkairoClient, public directory: string) {
    super();
  }

  public loadAll() {
    for (const api of this.read(`./${this.directory}`)) {
      const file = new (require(join(process.cwd(), api)).default)();

      this.set(file.options.name, file);
    }
  }

  public reloadAll() {
    for (const api of this.values()) {
      delete require.cache[require.resolve(api.directory)];

      this.delete(api.options.name);

      return this.loadAll();
    }
  }

  private read(directory: string, files = []): string[] {
    for (const file of readdirSync(directory)) {
      const path = join(directory, file);
      if (lstatSync(path).isDirectory()) files.concat(this.read(path, files));
      else files.push(path);
    }
    return files;
  }
}
