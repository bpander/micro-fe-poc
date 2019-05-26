import React from 'react';
import { BaseContainer } from 'conductor/BaseContainer';
import ReactDOM from 'react-dom';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CartItem } from 'checkout/modules/cart/types';
import { requestContext } from 'conductor/contexts';
import { DependencyMap } from 'shared/config/DependencyMap';
import { getTotalQuantity } from 'checkout/modules/cart/selectors';

export class CartIndicatorContainer extends BaseContainer {

  static tagName = 'cart-indicator-container';

  cartStream?: BehaviorSubject<CartItem[]>;

  onConnected() {
    this.cartStream = requestContext<DependencyMap, 'cartStream'>(this, 'cartStream');
    if (this.cartStream) {
      this.subscribeTo(this.cartStream);
    }
  }

  render() {
    if (!this.cartStream) {
      return;
    }
    const totalQuantity = getTotalQuantity(this.cartStream.getValue());
    ReactDOM.render(
      <div>Basket: {totalQuantity} item(s)</div>,
      this,
    );
  }
}
customElements.define(CartIndicatorContainer.tagName, CartIndicatorContainer);
