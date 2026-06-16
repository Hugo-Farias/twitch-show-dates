import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  runner: { disabled: true },
  manifest: {
    name: "Twitch show VOD date",
    description: "Show the date instead of relative time for Twitch VODs",
    version: "0.0.1",
  },
});
