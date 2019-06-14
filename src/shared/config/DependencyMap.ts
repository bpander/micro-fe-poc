import { Product } from 'team-product/modules/product/types/Product';
import { Store } from 'shared/state-manager';
import { requestContext } from 'shared/orchestrator/contexts';

export interface StoreMap {
  productsStore: Store<Product[]>;
}

export const requestStore = requestContext<StoreMap>();
