import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Product } from 'product/modules/product/types';

export interface DependencyMap {
  productStream: BehaviorSubject<Product[]>;
}
