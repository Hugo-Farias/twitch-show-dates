const { log, warn, error } = console;

const logPrefix = "tsd:";

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

export const wlog = (...content: Parameters<typeof warn>) => {
  warn(logPrefix, ...content);
};

// TODO: Find a better way to select the container
export function onElementAdd(
  element: Node,
  callback: (node: Node) => void,
): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        callback(node);
      }
    }
  });

  observer.observe(element, {
    childList: true,
    subtree: true,
  });

  return observer;
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

    if (count >= 150) {
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
