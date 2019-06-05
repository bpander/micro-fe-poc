import React from 'react';
import ReactDOM from 'react-dom';

import { registerContainer } from 'orchestrator/createContainer';
import { requestStore } from 'shared/config/DependencyMap';
import { map, tap } from 'rxjs/operators';
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

export const ProductDetailContainer = registerContainer<JSX.Element>({
  tagName: 'product-detail-container',
  attributes: [ 'sku' ],
  onConnected: async (el: HTMLElement) => {
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

    const sku = ''; // TODO: Get this from attributesStream
    const productStream = productsStore.stream.pipe(
      map(products => products.find(p => p.sku === sku)),
      tap(product => {
        if (!product) {
          fetchProductEpochStore.next(() => ({ type: EpochStatus.Loading, request: sku, force: false }));
        }
      }),
    );

    return combineLatest(fetchProductEpochStore.stream, productStream).pipe(
      map(([ fetchProductEpoch, product ]) => (
        <ProductDetail
          product={product}
          fetchProductEpoch={fetchProductEpoch}
          next={{ product: productsStore.next }}
        />
      )),
    );
  },

  // TODO: Make an adapter for this
  render: (el, jsx) => {
    ReactDOM.render(jsx, el);
  },
});
