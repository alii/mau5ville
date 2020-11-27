import { factory } from "./rpc";
import { constants } from "./config";
import ora from "ora";

const loading = ora("Connecting to Discord");
loading.start();

factory(constants.CLIENT_ID).then(async (client) => {
  client.updatePresence({
    details: "Listening to deadmau5",
    state: "Mining blocks",
    startTimestamp: new Date(),
    instance: true,
  });

  loading.succeed("Connected to Discord");

  await client.on("error", () => {
    loading.warn("An error occurred connecting to Discord");
  });
});
