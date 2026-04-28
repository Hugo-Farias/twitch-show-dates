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
    video.muted = false;
    videoContainer.remove();
    video.remove();
  }, 3000);
};

const replaceDateLabel = (element: HTMLDivElement) => {
  getDeepestLastElement(element).textContent = "test";
  const imgElement = element.querySelector<HTMLImageElement>("img[title]");
  if (!imgElement) return;
  const relativeDateElement = imgElement.title;
  console.log("relativeDateElement ==>", relativeDateElement);
};

export default defineContentScript({
  matches: ["https://*.twitch.tv/*"],
  runAt: "document_idle",
  main() {
    clog("init 🟢");

    until(() => {
      if (document.readyState !== "complete") return false;

      const sectionElement = document.querySelector<HTMLElement>(
        "div[data-test-selector='content'] > div",
      );

      if (!sectionElement) return false;

      sectionElement.scrollIntoView();

      onElementAdd(sectionElement, (added) => {
        console.log("changed");
        const addedElement = added as HTMLElement;
        const addedImgEl =
          addedElement.querySelector<HTMLImageElement>("img[title]");
        if (!addedImgEl) return;
        const dateLabelElement = addedImgEl.title;
        console.log("dateLabelElement ==>", dateLabelElement);

        // const articleElements = sectionElement.querySelectorAll("article");
        // console.log("articleElements ==>", articleElements);
      });

      return true;
    });

    devFunc();

    // window.navigation.dispatchEvent(new Event("navigate"));
  },
});
