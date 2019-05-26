import React from 'react';
import { BaseContainer } from 'conductor/BaseContainer';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Product } from 'product/modules/product/types';
import { requestContext } from 'conductor/contexts';
import { DependencyMap } from 'shared/config/DependencyMap';
import { fetchProduct } from 'product/modules/product/actions';
import { Suspense, lazy } from 'react';
import { Spinner } from 'shared/react/Spinner';
import ReactDOM from 'react-dom';
import { getProduct } from 'product/modules/product/selectors';
import { SomeLoaderAbstraction } from 'product/components/SomeLoaderAbstraction';

const ProductDetail = lazy(() => import('product/components/ProductDetail'));

export class ProductDetailContainer extends BaseContainer {
  static tagName = 'product-detail-container';

  productStream?: BehaviorSubject<Product[]>;

  onConnected() {
    // TODO: requestContext shouldn't need 'productStream' in the <> part
    this.productStream = requestContext<DependencyMap, 'productStream'>(this, 'productStream');
    if (this.productStream) {
      this.subscribeTo(this.productStream);
    }
  }

  // "Bind" action creators to the injected stream
  fetchProduct = async () => {
    if (this.productStream) {
      await fetchProduct(this.productStream);
    }
  }

  render() {
    const { productStream } = this;
    if (!productStream) {
      return;
    }

    // These would probably come from the route in real life
    const parentSku = 'tractor-parent-sku';
    const variantSku = 't_fendt';

    const product = getProduct(productStream.getValue(), parentSku);
    ReactDOM.render(
      <Suspense fallback={<Spinner />}>
        <SomeLoaderAbstraction
          fetchData={this.fetchProduct}
          needsData={!product}
          fallback={<Spinner />}
        >
          <ProductDetail product={product} variantSku={variantSku} />
        </SomeLoaderAbstraction>
      </Suspense>,
      this,
    );
  }
}
customElements.define(ProductDetailContainer.tagName, ProductDetailContainer);
