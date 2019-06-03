import React from 'react';
import { Product } from 'product/modules/product/types';

interface AddToCartButtonProps {
  addToCart: (sku: string, qty: number) => Promise<void>;
  product?: Product;
}

interface AddToCartButtonState {
  isAdding: boolean;
}

export class AddToCartButton extends React.Component<AddToCartButtonProps, AddToCartButtonState> {
  state = {
    isAdding: false,
  };

  onClick = async () => {
    this.setState({ isAdding: true });
    await this.props.addToCart(this.props.product!.sku, 1);
    this.setState({ isAdding: false });
  };

  render() {
    return (
      <button
        onClick={this.onClick}
        disabled={this.state.isAdding}
      >
        Buy for ${this.props.product!.variants[0].price.toFixed(2)}
      </button>
    );
  }
}