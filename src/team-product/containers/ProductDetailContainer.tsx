import React from 'react';
import { createContainer } from 'shared/orchestrator/createContainer';
import { requestStore } from 'shared/config/DependencyMap';
import { composeStore, mapStore } from 'shared/state-manager';
import { Product } from 'team-product/modules/product/types/Product';
import { reactAdapter } from 'shared/adapters/reactAdapter';

interface ProductDetailProps {
  sku: string | null;
  product?: Product;
}
const ProductDetail: React.FC<ProductDetailProps> = props => {
  if (!props.product) {
    return (
      <div>
        <p>Sku "{props.sku}" not found.</p>
      </div>
    );
  }
  return (
    <div>Name: {props.product.name}</div>
  );
};

export const ProductDetailContainer = createContainer(
  'product-detail-container',
  [ 'sku' ],
  (el, attributesStore) => {
    const productsStore = requestStore(el, 'productsStore');
    const skuStore = mapStore(attributesStore, a => a.sku);

    const propsStore = composeStore({
      sku: skuStore,
      product: mapStore(
        composeStore({ products: productsStore, sku: skuStore }),
        ({ products, sku }) => products.find(p => p.sku === sku),
      ),
    });

    return reactAdapter(el, propsStore, ProductDetail);
  },
);
