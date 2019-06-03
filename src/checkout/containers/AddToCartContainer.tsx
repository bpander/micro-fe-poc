import React from 'react';
import ReactDOM from 'react-dom';
import { BaseContainer } from 'conductor/BaseContainer';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CartItem } from 'checkout/modules/cart/types';
import { requestContext } from 'conductor/contexts';
import { DependencyMap } from 'shared/config/DependencyMap';
import { addToCart } from 'checkout/modules/cart/actions';
import { AddToCartButton } from 'checkout/components/AddToCardButton';
import { Product } from 'product/modules/product/types';
import { ErrorBoundary } from 'product/components/ErrorBoundary';
import { combineLatest, Observable, iif, of, partition, Subject } from 'rxjs';
import { map, filter, switchMap, takeUntil, takeWhile, finalize, flatMap, mergeMap, tap, distinctUntilChanged, withLatestFrom, pluck } from 'rxjs/operators';

export class AddToCartContainer extends BaseContainer {

  static tagName = 'add-to-cart';
  static get observedAttributes() { return [ 'data-sku' ]; }

  cartStream?: BehaviorSubject<CartItem[]>;

  onConnected() {
    this.cartStream = requestContext<DependencyMap, 'cartStream'>(this, 'cartStream');
  }

  addToCart = (product: Product) => async () => {
    const sku = this.getAttribute('data-sku');
    if (this.cartStream && sku) {
      await addToCart(this.cartStream)(sku, 1);
    }
  };

  render() {
    ReactDOM.render(
      (
        <div>{'hi'}</div>
      ),
      this,
    );
  }
}
customElements.define(AddToCartContainer.tagName, AddToCartContainer);

interface AttributeChange {
  name: string;
  oldValue: string | null;
  newValue: string | null;
}

const render = (el: HTMLElement, cart$: BehaviorSubject<CartItem[]>) => {
  const boundAddToCart = addToCart(cart$);
  return (product?: Product) => {
    ReactDOM.render(
      (
        <AddToCartButton
          addToCart={boundAddToCart}
          product={product}
        />
      ),
      el,
    );
  };
};

const fetchProduct = (stream: Subject<Product[]>) => (sku: string): Promise<void> => {
  return Promise.resolve();
};

const isDefined = function<T>(thing: T | undefined | null): thing is T {
  return thing !== undefined;
}

const onConnected = async (el: HTMLElement, attributes$: Observable<AttributeChange>) => {
  const contexts = await Promise.all([
    requestContext<DependencyMap, 'cartStream'>(el, 'cartStream'),
    requestContext<DependencyMap, 'productStream'>(el, 'productStream'),
  ]);
  const [ cart$, products$ ] = contexts;

  const sku$ = attributes$.pipe(
    filter(a => a.name === 'data-sku'),
    pluck('newValue'),
    filter(isDefined),
  );
  const product$ = combineLatest(sku$, products$).pipe(
    map(([ sku, products ]) => {
      const product = products.find(p => p.sku === sku);
      if (!product) {
        fetchProduct(products$);
      }
      return product;
    }),
  );

  return product$.subscribe(render(el, cart$));
};

// export const AddToCartElement = createContainer('add-to-cart-container', [ 'data-sku' ], onConnected);
// 