
const EVENT_NAME = 'context-requested';

interface ContextRequestedDetail<ContextMap, K extends keyof ContextMap> {
  name: K;
  context?: ContextMap[K];
};

export const requestContext = <ContextMap, K extends keyof ContextMap>(
  element: HTMLElement, name: K,
): ContextMap[K] => {
  const e = new CustomEvent<ContextRequestedDetail<ContextMap, K>>(
    EVENT_NAME, { bubbles: true, detail: { name } },
  );
  element.dispatchEvent(e);
  if (!e.detail.context) {
    throw new Error('something');
  }
  return e.detail.context;
};

export const provideContext = <ContextMap>(
  element: HTMLElement, data: Partial<ContextMap>,
) => {
  const handler = (e: CustomEvent<ContextRequestedDetail<ContextMap, keyof ContextMap>>) => {
    e.detail.context = data[e.detail.name];
    e.stopPropagation();
  };
  element.addEventListener(EVENT_NAME, handler as EventListener);
};
