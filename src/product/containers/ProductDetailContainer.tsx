import { BaseContainer } from 'conductor/BaseContainer';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Product } from 'product/modules/product/types';
import { requestContext } from 'conductor/contexts';
import { DependencyMap } from 'shared/config/DependencyMap';
import { fetchProduct } from 'product/modules/product/actions';

export class ProductDetailContainer extends BaseContainer {
  static tagName = 'product-detail-container';

  productStream?: BehaviorSubject<Product[]>;

  onConnected() {
    // TODO: requestContext shouldn't need 'productStream' in the <> part
    this.productStream = requestContext<DependencyMap, 'productStream'>(this, 'productStream');
    if (this.productStream) {
      this.subscribeTo(this.productStream);
      fetchProduct(this.productStream);
    }
  }

  render() {
    console.log(this.productStream && this.productStream.getValue());
  }
}
customElements.define(ProductDetailContainer.tagName, ProductDetailContainer);
