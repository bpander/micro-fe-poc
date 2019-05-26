import React from 'react';
import ReactDOM from 'react-dom';
import { BaseContainer } from 'conductor/BaseContainer';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CartItem } from 'checkout/modules/cart/types';
import { requestContext } from 'conductor/contexts';
import { DependencyMap } from 'shared/config/DependencyMap';
import { addToCart } from 'checkout/modules/cart/actions';
import { AddToCartButton } from 'checkout/components/AddToCardButton';

export class AddToCartContainer extends BaseContainer {

  static tagName = 'add-to-cart';
  static get observedAttributes() { return [ 'data-sku', 'data-price' ]; }

  cartStream?: BehaviorSubject<CartItem[]>;

  onConnected() {
    this.cartStream = requestContext<DependencyMap, 'cartStream'>(this, 'cartStream');
  }

  addToCart = async () => {
    const sku = this.getAttribute('data-sku');
    if (this.cartStream && sku) {
      await addToCart(this.cartStream, sku, 1);
    }
  };

  render() {
    const price = parseFloat(this.getAttribute('data-price') || '');
    ReactDOM.render(
      <AddToCartButton
        price={price}
        addToCart={this.addToCart}
      />,
      this,
    );
  }
}
customElements.define(AddToCartContainer.tagName, AddToCartContainer);
