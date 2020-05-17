import { Listener } from "discord-akairo";
import { VoiceServer } from "lavaclient";

export default class VoiceServerUpdateListener extends Listener {
  public constructor() {
    super("VOICE_SERVER_UPDATE", {
      emitter: "websocket",
      event: "VOICE_SERVER_UPDATE",
    });
  }

  public exec(server: VoiceServer) {
    this.client.manager.serverUpdate(server);
  }
}
