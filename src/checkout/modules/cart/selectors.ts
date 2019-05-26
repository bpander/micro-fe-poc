import { CartItem } from './types';

export const getTotalQuantity = (cartItems: CartItem[]) => {
  return cartItems.reduce((acc, c) => acc + c.quantity, 0);
};
