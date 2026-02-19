import { dlog } from "../helper";

let mainInterval: ReturnType<typeof setInterval>;

export default defineContentScript({
  matches: ["https://*.twitch.tv/*"],
  main() {
    dlog(document.readyState);

    mainInterval = setInterval(() => {
      const video = document.querySelector("video");
      if (!video) return null;
      if (video?.readyState >= 4) return null;
      if (document.readyState !== "complete") return null;

      dlog("video ==>", video);

      video.pause();
      video.muted = false;

      dlog(video.duration);

      clearInterval(mainInterval);
    }, 500);
  },
});
