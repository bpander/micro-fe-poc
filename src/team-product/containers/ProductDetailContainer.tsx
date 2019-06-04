import React from 'react';
import ReactDOM from 'react-dom';

import { registerContainer } from 'orchestrator/createContainer';
import { requestStore } from 'shared/config/DependencyMap';
import { map } from 'rxjs/internal/operators';

export const ProductDetailContainer = registerContainer<JSX.Element>({
  tagName: 'product-detail-container',
  attributes: [],
  onConnected: async (el: HTMLElement) => {
    const productStore = await requestStore(el, 'productsStore');

    /* TODO:
    // listenWith is like combineLatest but with object instead of array
    const propsStream = listenWith({ products: productStore });
    const propStream.pipe(map(props => {
      <ProductDetail
        {...props}
        next={{ product: productStore.next }}
      />
     */

    return productStore.stream.pipe(
      map(products => <div>{products.length}</div>),
    );
  },

  // TODO: Make an adapter for this
  render: (el, jsx) => {
    ReactDOM.render(jsx, el);
  },
});
