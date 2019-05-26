import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Product } from 'product/modules/product/types';
import { CartItem } from 'checkout/modules/cart/types';

export interface DependencyMap {
  cartStream: BehaviorSubject<CartItem[]>;
  productStream: BehaviorSubject<Product[]>;
}
