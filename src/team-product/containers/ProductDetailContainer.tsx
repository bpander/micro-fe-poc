import React from 'react';
import ReactDOM from 'react-dom';

import { registerContainer } from 'orchestrator/createContainer';
import { requestStore } from 'shared/config/DependencyMap';
import { map, tap, share } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { fetchProduct } from 'team-product/modules/product/actions';
import { EpochStatus, Next, Epoch } from 'shared/stateManager';
import { Product } from 'team-product/modules/product/types';

interface ProductDetailProps {
  product: Product | undefined;
  fetchProductEpoch: Epoch<string>;
  next: { product: Next<Product[]> };
}
const ProductDetail: React.FC<ProductDetailProps> = props => {
  const onClick: React.MouseEventHandler = () => {
    // props.next.product(s => [ ...s, { sku: '' + s.length, name: 'product ' + s.length } ]);
  };

  console.log(props.fetchProductEpoch);
  if (props.fetchProductEpoch.type === EpochStatus.Loading) {
    return <div>Loading...</div>;
  }

  if (!props.product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      {props.product.name}
      <button onClick={onClick}>add</button>
    </div>
  );
};

export const ProductDetailContainer = registerContainer<JSX.Element, { sku: string | null }>({
  tagName: 'product-detail-container',
  attributes: [ 'sku' ],
  onConnected: async (el: HTMLElement, attributesStream) => {
    const productsStore = await requestStore(el, 'productsStore');
    const fetchProductEpochStore = fetchProduct(productsStore);

    /* TODO:
    // listenWith is like combineLatest but with object instead of array
    const propsStream = listenWith({ products: productStore });
    const propStream.pipe(map(props => {
      <ProductDetail
        {...props}
        next={{ product: productStore.next }}
      />
    */

    const productStream = combineLatest(productsStore.stream, attributesStream).pipe(
      map(([ products, attributes ]) => products.find(p => p.sku === attributes.sku)),
      tap(async product => {
        console.log('tap', product);
        if (!product) {
          console.log('fetchProduct next');
          await fetchProductEpochStore.next(() => ({ type: EpochStatus.Loading, request: '', force: false }));
        }
      }),
    );

    return combineLatest(productStream, fetchProductEpochStore.stream).pipe(
      tap(console.log),
      map(([ product, fetchProductEpoch ]) => (
        <div>hi {product && product.name}</div>
      )),
    );
  },

  // TODO: Make an adapter for this
  render: (el, jsx) => {
    ReactDOM.render(jsx, el);
  },
});
