import { provideContext } from 'orchestrator/contexts';
import { StoreMap } from 'shared/config/DependencyMap';
import { createStore } from 'shared/stateManager';
import { Product } from 'team-product/modules/product/types';

import 'index.css';

const rootEl = document.getElementById('root');
provideContext<StoreMap>(rootEl!, {
  productsStore: createStore<Product[]>([]),
});
