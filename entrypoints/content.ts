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

// TODO: Swap the date label with the title of the image in the article element
// FIX: Swaping the date label with the title causes the date to be swaped again 
const replaceDateLabel = (element: Element) => {
  const imgElement = element.querySelector<HTMLImageElement>("img[title]");
  // if (!imgElement) return;

  if (element.tagName !== "ARTICLE") {
    if (element.tagName === "DIV") {
      const articleElement = element.querySelector<HTMLDivElement>("article");
      if (!articleElement) return;

      element = articleElement;
    } else {
      console.log("Element is not ARTICLE or DIV, skipping:", element.tagName);
      return null;
    }
  }
  const dateElement = getDeepestLastElement(element);

  if (!imgElement) return;

  const prevDateText = dateElement.textContent;
  console.log("prevDateText ==>", prevDateText);
  dateElement.textContent = imgElement.title;
  if (imgElement.parentElement) {
    imgElement.parentElement.title = prevDateText || "";
    imgElement.title = "";
  }
  element.setAttribute("tw-date-label-replaced", "true");
};

let prevUrl = "";

export default defineContentScript({
  matches: ["https://*.twitch.tv/*"],
  runAt: "document_idle",
  main() {
    clog("init 🟢");

    window.navigation.addEventListener("navigate", () => {
      clogdev("navigate event fired");

      until(() => {
        if (document.readyState !== "complete") return false;

        // const sectionElement = document.querySelector<HTMLElement>(
        //   "section[aria-label='Main Content']",
        // );

        const sectionElement = document.querySelector<HTMLDivElement>(
          "div.channel-info-content",
        );

        console.log("sectionElement ==>", sectionElement);

        if (!sectionElement) return false;

        const articleElements =
          sectionElement.querySelectorAll<HTMLElement>("article");

        console.log("articleElements.length ==>", articleElements.length);

        if (articleElements.length <= 0) return false;

        setTimeout(() => {
          if (window.location.href === prevUrl) return false;
          prevUrl = window.location.href;
          articleElements.forEach((article) => {
            replaceDateLabel(article);
          });
        }, 300);

        sectionElement.scrollIntoView();

        onElementAdd(sectionElement, (added) => {
          const addedElement = added as HTMLElement;

          if (!addedElement.tagName) return;

          replaceDateLabel(addedElement);
        });

        return true;
      });
    });

    devFunc();

    window.navigation.dispatchEvent(new Event("navigate"));
  },
});
