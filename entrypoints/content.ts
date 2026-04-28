import { clog, getDeepestLastElement, onElementAdd, until } from "@/helper";

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
    video.muted = true;
    // videoContainer.remove();
    // video.remove();
  }, 3000);
};

const replaceDateLabel = (element: HTMLElement) => {
  getDeepestLastElement(element).textContent = "test";
  const imgElement = element.querySelector<HTMLImageElement>("img[title]");
  if (!imgElement) return;

  if (element.tagName !== "ARTICLE" && element.tagName === "DIV") {
    const articleElement = element.querySelector<HTMLElement>("article");
    if (!articleElement) return;

    element = articleElement;
  }

  const dateElement = getDeepestLastElement(element);

  if (!imgElement) return;

  dateElement.textContent = imgElement.title;
};

export default defineContentScript({
  matches: ["https://*.twitch.tv/*"],
  runAt: "document_idle",
  main() {
    clog("init 🟢");

    until(() => {
      console.log("navigate event fired");

      if (document.readyState !== "complete") return false;

      // const sectionElement = document.querySelector<HTMLElement>(
      //   "section[aria-label='Main Content']",
      // );
      const sectionElement = document.querySelector<HTMLDivElement>(
        "div.channel-info-content",
      );

      if (!sectionElement) return false;

      sectionElement.scrollIntoView();

      onElementAdd(sectionElement, (added) => {
        const addedElement = added as HTMLElement;

        if (!addedElement.tagName) return;

        replaceDateLabel(addedElement);
      });

      return true;
    });

    devFunc();

    // window.navigation.dispatchEvent(new Event("navigate"));
  },
});
