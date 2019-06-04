import { provideContext } from 'orchestrator/contexts';
import { StoreMap } from 'shared/config/DependencyMap';
import { createStore } from 'shared/stateManager';
import { Product } from 'team-product/modules/product/types';

import { ProductDetailContainer } from 'team-product/containers/ProductDetailContainer';

import 'index.css';

const rootEl = document.getElementById('root');
provideContext<StoreMap>(rootEl!, {
  productsStore: createStore<Product[]>([]),
});

const pdc = new ProductDetailContainer();
rootEl!.appendChild(pdc);
