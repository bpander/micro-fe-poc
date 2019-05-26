import React from 'react';

interface AddToCartButtonProps {
  price: number;
  addToCart: () => Promise<void>;
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
    await this.props.addToCart();
    this.setState({ isAdding: false });
  };

  render() {
    return (
      <button
        onClick={this.onClick}
        disabled={this.state.isAdding}
      >
        Buy for ${this.props.price.toFixed(2)}
      </button>
    );
  }
}