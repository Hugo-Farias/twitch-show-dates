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

  clogdev("Running in development mode, executing devFunc");

  setTimeout(() => {
    // const videoContainer =
    //   document.querySelector<HTMLDivElement>(".persistent-player");

    const video = document.querySelector<HTMLVideoElement>("video");

    if (!video) return;
    // if (!videoContainer) return;

    video.pause();
    video.muted = true;
    // videoContainer.remove();
    // video.remove();
  }, 3000);
};

const replaceDateLabel = (element: Element) => {
  const imgElement = element.querySelector<HTMLImageElement>("img[title]");
  if (!imgElement) return;

  if (element.tagName !== "ARTICLE") {
    if (element.tagName === "DIV") {
      const articleElement = element.querySelector<HTMLDivElement>("article");
      if (!articleElement) return;

      element = articleElement;
    } else {
      clogdev("Element is not ARTICLE or DIV, skipping:", element.tagName);
      return null;
    }
  }

  const dateElement = getDeepestLastElement(element);

  if (
    element.getAttribute("tw-date-label-replaced") === dateElement.textContent
  ) {
    return null;
  }

  // if (!imgElement) return;

  // const prevDateText = dateElement.textContent;

  // element.setAttribute("tw-date-label-replaced", dateElement.textContent || "");

  dateElement.textContent = imgElement.title;

  // if (imgElement.parentElement && prevDateText) {
  //   console.log("prevDateText ==>", prevDateText);
  //   imgElement.parentElement.title = prevDateText;
  //   imgElement.title = "";
  // }
};

let prevUrl = "";

export default defineContentScript({
  matches: ["https://*.twitch.tv/*"],
  runAt: "document_idle",
  main() {
    clog("init 🟢");

    window.navigation.addEventListener("navigate", () => {
      until(() => {
        if (document.readyState !== "complete") return false;

        // const sectionElement = document.querySelector<HTMLElement>(
        //   "section[aria-label='Main Content']",
        // );

        const sectionElement = document.querySelector<HTMLDivElement>(
          "div.channel-info-content",
        );

        if (!sectionElement) return false;

        const articleElements =
          sectionElement.querySelectorAll<HTMLElement>("article");

        if (articleElements.length <= 0) return false;

        setTimeout(() => {
          if (window.location.href === prevUrl) return false;
          prevUrl = window.location.href;

          articleElements.forEach((article) => {
            replaceDateLabel(article);
          });
        }, 100);

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
