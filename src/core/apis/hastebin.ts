import { API } from "../../library/structures";
import fetch from "node-fetch";

export default class HastebinAPI extends API {
  public constructor() {
    super({
      name: "hastebin",
      uri: "https://hasteb.in",
    });

    this.post = this.post;
  }

  public async post(text: string, extension = "txt") {
    const res = await fetch(`${this.options.uri}/documents`, {
      method: "POST",
      body: text,
      headers: {
        "Content-Type": "text/plain",
      },
    });

    const { key } = await res.json();
    return `${this.options.uri}/${key}.${extension}`;
  }
}
