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

export function onChildAdded(
  target: HTMLElement,
  callback: (added: Element[], mutation: MutationRecord) => void,
  options: MutationObserverInit = { childList: true },
): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      if (mutation.addedNodes.length === 0) continue;

      const addedElements = Array.from(mutation.addedNodes).filter(
        (n): n is Element => n.nodeType === Node.ELEMENT_NODE,
      );

      if (addedElements.length > 0) {
        callback(addedElements, mutation);
      }
    }
  });

  observer.observe(target, {
    childList: true,
    ...options,
  });

  return observer; // so you can disconnect() later
}

export function getDeepestLastElement(root: Element): Element {
  let current: Element = root;

  while (current.lastElementChild) {
    current = current.lastElementChild;
  }

  return current;
}
