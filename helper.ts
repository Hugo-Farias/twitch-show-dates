const { log, warn, error } = console;

const logPrefix = "tsd:";

export const clog = (...content: Parameters<typeof log>) => {
  log(logPrefix, ...content);
};

export const elog = (...content: Parameters<typeof error>) => {
  error(logPrefix, ...content);
};

export const wlog = (...content: Parameters<typeof warn>) => {
  warn(logPrefix, ...content);
};

// TODO: Make search more strict by only looking for img elements
export function onImgAdded(
  root: ParentNode,
  callback: (added: HTMLImageElement) => void,
  options: MutationObserverInit = { childList: true, subtree: true },
): MutationObserver {
  const selector = "img.tw-image[data-test-selector]";

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;

      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        const el = node as Element;

        // If the added node itself matches
        if (el.matches(selector)) {
          callback(el as HTMLImageElement);
        }

        // If matching elements exist inside the subtree
        const nested = el.querySelectorAll(selector);
        for (const img of nested) {
          callback(img as HTMLImageElement);
        }
      }
    }
  });

  observer.observe(root, options);
  return observer;
}

export function getDeepestLastElement(root: Element): Element {
  let current: Element = root;

  while (current.lastElementChild) {
    current = current.lastElementChild;
  }

  return current;
}
