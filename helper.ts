const { log, error } = console;

const logPrefix = "Twitch-Show-VOD-Date:";

export const clog = (...content: Parameters<typeof log>) => {
  log(logPrefix, ...content);
};

export const clogdev = (...content: Parameters<typeof log>) => {
  if (!import.meta.env.DEV) return;
  log(logPrefix, ...content);
};

export const elog = (...content: Parameters<typeof error>) => {
  error(logPrefix, ...content);
};

let observerConnected: MutationObserver;

export function onElementAdd(element: Node, callback: (node: Node) => void) {
  if (observerConnected) {
    observerConnected.disconnect();
  }

  observerConnected = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (!node.getAttribute("data-a-target")) return;
        if (node.getAttribute("tw-date-label-replaced")) return;

        callback(node);
      });
    });
  });

  observerConnected.observe(element, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["tw-date-label-replaced"],
  });
}

export function getDeepestLastElement(root: Element): Element {
  let current: Element = root;

  while (current.lastElementChild) {
    current = current.lastElementChild;
  }

  return current;
}

// Wait until the function returns true, then clear the interval
export const until = (fn: () => boolean | undefined, delay = 300) => {
  let count = 0;

  const id = setInterval(() => {
    count++;

    if (count >= 50) {
      clearInterval(id);
      elog(
        "until: function did not return true within the specified amount of attempts",
      );
    }

    if (fn()) {
      clearInterval(id);
      return;
    }
  }, delay);
};
