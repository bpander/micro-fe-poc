import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';
import { merge } from 'rxjs/internal/observable/merge';

export abstract class BaseContainer extends HTMLElement {

  private subscription: Subscription | undefined;

  private connectedCallback() {
    this.onConnected();
    if (!this.subscription || this.subscription.closed) {
      this.render();
    }
  }

  private disconnectedCallback() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.onDisconnected();
  }

  private attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (this.shouldUpdate(name, oldValue, newValue)) {
      this.render();
    }
  }

  shouldUpdate(name: string, oldValue: string | null, newValue: string | null): boolean {
    return true;
  }

  subscribeTo(...observables: Observable<any>[]) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = merge(...observables).subscribe(() => this.render());
  }

  onConnected() {}
  render() {}
  onDisconnected() {}
}
