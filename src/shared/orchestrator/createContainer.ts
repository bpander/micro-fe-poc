import { Store, createStore } from 'shared/state-manager';

interface Container<A> {
  tagName: string;
  observedAttributes: A[];
}

const getAttributeValues = <A extends string>(el: HTMLElement, observedAttributes: A[]): Record<A, string | null> => {
  const record = observedAttributes.reduce(
    (acc, curr) => Object.assign(acc, { [curr]: el.getAttribute(curr) }),
    {},
  );
  return record as Record<A, string | null>;
};

export const createContainer = <A extends string>(
  tagName: string,
  observedAttributes: A[],
  onConnected: (el: HTMLElement, attributesStore: Store<Record<A, string | null>>) => Function | void,
): Container<A> => {
  const Container = class extends HTMLElement {
    static tagName = tagName;
    static get observedAttributes() { return observedAttributes; }

    attributesStore: Store<Record<A, string | null>> | void = undefined;
    onDisconnected: Function | void = undefined;

    attributeChangedCallback(name: A, oldValue: string | null, newValue: string | null) {
      if (this.attributesStore) {
        this.attributesStore.dispatch(a => ({ ...a, [name]: newValue }));
      }
    }

    connectedCallback() {
      this.attributesStore = createStore(getAttributeValues(this, observedAttributes));
      this.onDisconnected = onConnected(this, this.attributesStore);
    }

    disconnectedCallback() {
      if (this.onDisconnected) {
        this.onDisconnected();
      }
      this.attributesStore = undefined;
    }
  }
  customElements.define(tagName, Container);
  return Container;
};
