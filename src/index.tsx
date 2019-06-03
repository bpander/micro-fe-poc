import 'index.css';
import { provideContext, requestContext } from 'conductor/contexts';
import { DependencyMap } from 'shared/config/DependencyMap';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Product } from 'product/modules/product/types';
import { XApp } from 'XApp';
import { CartItem } from 'checkout/modules/cart/types';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fetchProduct } from 'product/modules/product/actions';
import { addToCart } from 'checkout/modules/cart/actions';

const rootEl = document.getElementById('root');
if (rootEl) {
  provideContext<DependencyMap>(rootEl, {
    cartStream: new BehaviorSubject<CartItem[]>([]),
    productStream: new BehaviorSubject<Product[]>([]),
  });
  // const appEl = document.createElement(XApp.tagName);
  // rootEl.appendChild(appEl);
}



{/*
<x-suspense>
  <x-suspense-fallback><Spinner /></x-suspense-fallback>
  <x-suspense-resolved>
    finished loading.
  </x-suspense-resolved>
</x-suspense>
*/}
const makeSuspenseful = (el: HTMLElement, promise: Promise<any>) => {
  // trigger suspense start event
  promise.then(() => {/* trigger suspense end event */});

  return promise;
};



interface AddToCartProps {
  sku: string | null;
  addToCart: () => Promise<void>;
  product?: Product;
}
const AddToCart: React.FC<AddToCartProps> = props => (
  <div>{props.product && props.product.name}</div>
);

const onConnected = (el: HTMLElement, attributesStream: Observable<{ sku: string | null }>) => {
  const cartStream = new BehaviorSubject<CartItem[]>([]); // requestContext(el, 'cartStream');
  const productStream = new BehaviorSubject<Product[]>([]); // requestContext(el, 'productStream');

  return combineLatest(attributesStream, productStream).pipe(
    map(([ attributes, products ]): AddToCartProps => {
      const product = products.find(p => p.sku === attributes.sku);
      if (!product) {
        makeSuspenseful(el, fetchProduct(productStream));
      }
      return {
        sku: attributes.sku,
        product,
        addToCart: () => addToCart(cartStream, attributes.sku!, 1),
      };
    }),
    map(AddToCart),
  );
};
// createElement('add-to-cart-button', [ 'sku' ], reactAdapter(onConnected));

const attributesTest = function<T>(keys: Array<keyof T>, fn: (attrs: { [K in keyof T]: string | null }) => void) {

};

const attrs = attributesTest([ 'a', 'b' ], attributes => {
  attributes.a;
});
