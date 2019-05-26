import React from 'react';
import { Product } from 'product/modules/product/types';

interface ProductDetailProps {
  product: Product | undefined;
  variantSku: string;
}

export default class ProductDetail extends React.Component<ProductDetailProps> {

  getVariant() {
    if (!this.props.product) {
      return;
    }
    return this.props.product.variants.find(v => v.sku === this.props.variantSku);
  }

  render() {
    const { props } = this;
    if (!props.product) {
      return <h1>Product not found</h1>
    }
    const variant = this.getVariant();
    return (
      <div>
        <h1>The Model Store</h1>
        <h2>{props.product.name}</h2>
        {(variant) && <h3>{variant.name}</h3>}
      </div>
    );
  }
}
