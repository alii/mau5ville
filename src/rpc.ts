import { Client, Presence } from "discord-rpc";
import { EventEmitter } from "events";

export async function factory(clientId: string) {
  const rpc = new Client({ transport: "ipc" });

  let connected = false;
  let activityCache: Presence | null = null;

  const instance = new (class RP extends EventEmitter {
    updatePresence(d: Presence) {
      if (connected) {
        rpc.setActivity(d).catch((e: Error) => this.emit("error", e));
      } else {
        activityCache = d;
      }
    }

    disconnect() {
      rpc.destroy().catch((e: Error) => this.emit("error", e));
    }
  })();

  await rpc
    .login({ clientId })
    .then(() => {
      instance.emit("connected");
      connected = true;

      if (activityCache) {
        rpc.setActivity(activityCache).catch((e) => instance.emit("error", e));
        activityCache = null;
      }
    })
    .catch((e: Error) => instance.emit("error", e));

  return instance;
}
