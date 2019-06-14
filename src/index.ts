import { ProductDetailContainer } from 'team-product/containers/ProductDetailContainer';
import 'index.css';
import { provideContext } from 'shared/orchestrator/contexts';
import { StoreMap } from 'shared/config/DependencyMap';
import { createStore } from 'shared/state-manager';
import { Product } from 'team-product/modules/product/types/Product';

const pdc = document.createElement(ProductDetailContainer.tagName);
const root = document.getElementById('root')!;

provideContext<StoreMap>(root, {
  productsStore: createStore<Product[]>([ { sku: 'test', name: 'something' } ]),
});

pdc.setAttribute('sku', '!%$@');
root.appendChild(pdc);

(window as any).pdc = pdc;
