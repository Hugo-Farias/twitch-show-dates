import {
  clog,
  clogdev,
  getDeepestLastElement,
  onElementAdd,
  until,
} from "@/helper";

// Only run in development mode
const devFunc = () => {
  if (!import.meta.env.DEV) return;

  clog("Running in development mode, executing devFunc");

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
  const imgElement = element.querySelector<HTMLImageElement>("img[title]");
  if (!imgElement) return;

  if (element.tagName !== "ARTICLE" && element.tagName === "DIV") {
    const articleElement = element.querySelector<HTMLElement>("article");
    if (!articleElement) return;

    element = articleElement;
  } else {
    return null;
  }

  const dateElement = getDeepestLastElement(element);

  if (!imgElement) return;

  dateElement.textContent = imgElement.title;
  dateElement.setAttribute("tw-date-label-replaced", "true");
};

let onElementAddObserver: MutationObserver;

export default defineContentScript({
  matches: ["https://*.twitch.tv/*"],
  runAt: "document_idle",
  main() {
    clog("init 🟢");

    window.navigation.addEventListener("navigate", () => {
      clogdev("navigate event fired");

      if (onElementAddObserver) {
        onElementAddObserver.disconnect();
      }

      until(() => {
        // console.log("onElementAddObserver ==>", onElementAddObserver);
        // if (onElementAddObserver) return true;
        if (document.readyState !== "complete") return false;

        // const sectionElement = document.querySelector<HTMLElement>(
        //   "section[aria-label='Main Content']",
        // );

        const sectionElement = document.querySelector<HTMLDivElement>(
          "div.channel-info-content",
        );

        console.log("sectionElement ==>", sectionElement);

        if (!sectionElement) return false;

        sectionElement.scrollIntoView();

        // TODO: Finish this
        onElementAddObserver = onElementAdd(sectionElement, (added) => {
          const addedElement = added as HTMLElement;

          if (!addedElement.tagName) return;
          // if (addedElement.tagName !== "A") return;

          console.log("addedElement ==>", addedElement);

          replaceDateLabel(addedElement);
        });

        return true;
      });
    });
    devFunc();

    window.navigation.dispatchEvent(new Event("navigate"));
  },
});
