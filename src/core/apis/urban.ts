import { API } from "../../library/structures";
import fetch from "node-fetch";

export default class UrbanAPI extends API {
  public constructor() {
    super({
      name: "urban",
      uri: "https://api.urbandictionary.com/v0/",
    });

    this.search = this.search;
  }

  public async search(term: string) {
    const res = await fetch(
      `${this.options.uri}define?term=${encodeURIComponent(term)}`
    );

    return (await res.json()).list[0] || "ERROR";
  }
}
