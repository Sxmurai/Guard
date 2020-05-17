import { Listener } from "discord-akairo";
import { VoiceState } from "lavaclient";

export default class VoiceStateUpdateListener extends Listener {
  public constructor() {
    super("VOICE_STATE_UPDATE", {
      emitter: "websocket",
      event: "VOICE_STATE_UPDATE",
    });
  }

  public exec(state: VoiceState) {
    this.client.manager.stateUpdate(state);
  }
}
