import { APIManager } from ".";
import { AkairoClient } from "discord-akairo";

interface APIOptions {
  name: string;
  uri: string;
}

export default class API {
  public directory: string = __dirname;
  public handler: APIManager;

  public client: AkairoClient = APIManager.prototype.client;

  public constructor(public options: APIOptions) {
    this.options = options;
  }
}
