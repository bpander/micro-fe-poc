import { Product } from 'team-product/modules/product/types';
import { Store } from 'shared/stateManager';
import { requestContext } from 'orchestrator/contexts';

export interface StoreMap {
  productsStore: Store<Product[]>;
}

export const requestStore = requestContext<StoreMap>();
