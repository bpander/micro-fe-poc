import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

interface Attributes {
  [key: string]: string | null;
}

export interface ContainerConfig<T, A extends Attributes> {
  tagName: string;

  // TODO: Make attributesStream infer keys from `attributes`
  attributes: Array<keyof A>;
  onConnected: (el: HTMLElement, attributesStream: Observable<Attributes>) => Promise<Observable<T>>;

  render?: (el: HTMLElement, data: T) => void;
}

export const registerContainer = <T, A extends Attributes>(config: ContainerConfig<T, A>) => {
  // TODO: Make this capable of extending other element types
  class Container extends HTMLElement {

    static get observedAttributes() { return config.attributes }
    static tagName = config.tagName;

    private attributesStream: BehaviorSubject<Attributes>;
    private subscription?: Subscription;

    constructor() {
      super();
      const initialAttributes = config.attributes.reduce(
        (acc, name) => ({ ...acc, [name]: this.getAttribute(name as string) }),
        {},
      );
      this.attributesStream = new BehaviorSubject<Attributes>(initialAttributes);
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
      this.attributesStream.next({ ...this.attributesStream.getValue(), [name]: newValue });
    }

    disconnectedCallback() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    async connectedCallback() {
      // TODO: Dispatch suspense start here
      const dataStream = await config.onConnected(this, this.attributesStream);
      // TODO: Dispatch suspense end here

      const noop = () => {}; // TODO: Get this from a library
      const render = config.render || noop;
      this.subscription = dataStream.subscribe(data => render(this, data));
    }
  }
  customElements.define(config.tagName, Container);

  return Container;
};
