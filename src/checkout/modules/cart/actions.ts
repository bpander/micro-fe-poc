import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import { CartItem } from './types';

const latency = (duration: number) => new Promise(resolve => setTimeout(resolve, duration));

export const addToCart = async (stream: BehaviorSubject<CartItem[]>, sku: string, quantity: number) => {
  await latency(300);

  const cartItemMap = keyBy(stream.getValue(), c => c.sku);
  const existingCartItem = cartItemMap[sku];
  const newCartItem = (existingCartItem)
    ? { ...existingCartItem, quantity: existingCartItem.quantity + quantity }
    : { sku, quantity };
  const newCartItemMap = { ...cartItemMap, [sku]: newCartItem };
  stream.next(values(newCartItemMap));
};
