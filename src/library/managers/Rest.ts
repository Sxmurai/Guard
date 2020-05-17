import { Node, TrackInfo, LoadTrackResponse } from "@kyflx-dev/lavalink-types";
import fetch from "node-fetch";

export default class Rest {
  public static async decode(track: string, node: Node): Promise<TrackInfo> {
    const res = await fetch(
      `http://${node.address}:${node.port}/decodetrack?track=${track}`,
      {
        headers: {
          authorization: node.password,
        },
      }
    );

    return (await res.json()) ?? {};
  }

  public static async search(
    track: string,
    node: Node
  ): Promise<LoadTrackResponse> {
    const res = await fetch(
      `http://${node.address}:${node.port}/loadtracks?identifier=${track}`,
      {
        headers: {
          authorization: node.password,
        },
      }
    );

    return (await res.json()) ?? {};
  }
}
