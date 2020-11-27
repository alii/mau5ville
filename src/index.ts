import { factory } from "./rpc";
import { constants } from "./config";
import ora from "ora";

const loading = ora("Connecting to Discord").start();

factory(constants.CLIENT_ID).then(async (client) => {
  client.updatePresence({
    details: "Listening to deadmau5",
    state: "Mining blocks",
    startTimestamp: new Date(),
    instance: true,
    largeImageKey: "mau5",
    largeImageText: "deadmau5",
  });

  loading.succeed("Connected to Discord");

  await client.on("error", (error: Error) => {
    loading.warn(`An error occurred connecting to Discord: ${error.message}`);
  });
});
