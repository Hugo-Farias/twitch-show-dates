import { clog, onImgAdded } from "@/helper";

let mainInterval: ReturnType<typeof setInterval>;

// Only run in development mode
const devFunc = () => {
  if (!import.meta.env.DEV) return;
  setTimeout(() => {
    const videoContainer =
      document.querySelector<HTMLDivElement>(".persistent-player");

    const video = document.querySelector<HTMLVideoElement>("video");

    if (!video) return;
    if (!videoContainer) return;

    video.pause();
    video.muted = false;
    videoContainer.remove();
  }, 3000);
};

let intervalCount = 0; // contingency for infinite loop
const totalIntervals = 50; // max intervals to try before giving up
let observer: MutationObserver;

// TODO: Handle SPA navigation by re-running the script when the URL changes
// Possible solution: Find an event to attach this code to
export default defineContentScript({
  matches: ["https://*.twitch.tv/*"],
  runAt: "document_idle",
  main() {
    clog("init 🟢");

    if (observer) observer.disconnect();

    mainInterval = setInterval(() => {
      console.log("interval");
      intervalCount++;

      if (intervalCount > totalIntervals) {
        clearInterval(mainInterval);
        return;
      }

      // const vodsSection = document.querySelector<HTMLDivElement>(
      //   "div.channel-root__info > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div",
      // );

      const vodsSection = document.querySelector<HTMLDivElement>(
        'div[data-test-selector^="content"]',
      );

      if (document.readyState !== "complete") return null;
      if (!vodsSection) return null;
      clearInterval(mainInterval);

      vodsSection.style.backgroundColor = "rgba(255 255 0 / 0.1)";

      vodsSection.scrollIntoView({ behavior: "smooth", block: "start" });

      // TODO: disconnect observer when changing pages
      observer = onImgAdded(vodsSection, (added) => {
        if (!added.title) return null;
        console.log(
          "added ==>",
          added.parentElement?.parentElement?.parentElement,
        );
        // added.forEach((el) => {
        //   getDeepestLastElement(el).textContent =
        //     el.querySelectorAll("img")[1]?.title;
        // });
      });

      devFunc();
    }, 200);
  },
});
