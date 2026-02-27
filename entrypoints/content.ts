import { clog, getDeepestLastElement, onChildAdded } from "@/helper";

let mainInterval: ReturnType<typeof setInterval>;

// Only run in development mode
const devFunc = () => {
  if (!import.meta.env.DEV) return;
  const videoContainer =
    document.querySelector<HTMLDivElement>(".persistent-player");

  const video = document.querySelector<HTMLVideoElement>("video");

  if (!video) return;
  if (!videoContainer) return;

  video.pause();
  video.muted = false;
  videoContainer.remove();
};

export default defineContentScript({
  matches: ["https://*.twitch.tv/*"],
  runAt: "document_idle",
  main() {
    clog("init 🟢");
    mainInterval = setInterval(() => {
      const vodsSection = document.querySelector<HTMLDivElement>(
        "div.channel-root__info > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div",
      );

      if (document.readyState !== "complete") return null;
      if (!vodsSection) return null;
      clearInterval(mainInterval);

      vodsSection.style.backgroundColor = "rgba(255 0 0 / 0.1)";

      vodsSection.scrollIntoView({ behavior: "smooth", block: "start" });

      onChildAdded(vodsSection, (added) => {
        added.forEach((el) => {
          getDeepestLastElement(el).textContent =
            el.querySelectorAll("img")[1]?.title;
          // clog(el.querySelectorAll("img")[1]?.title);
        });
      });

      devFunc();
    }, 200);
  },
});
