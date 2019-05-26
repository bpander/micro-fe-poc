import 'index.css';
import { provideContext } from 'conductor/contexts';
import { DependencyMap } from 'shared/config/DependencyMap';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Product } from 'product/modules/product/types';
import { XApp } from 'XApp';
import { CartItem } from 'checkout/modules/cart/types';

const rootEl = document.getElementById('root');
if (rootEl) {
  provideContext<DependencyMap>(rootEl, {
    cartStream: new BehaviorSubject<CartItem[]>([]),
    productStream: new BehaviorSubject<Product[]>([]),
  });
  const appEl = document.createElement(XApp.tagName);
  rootEl.appendChild(appEl);
}
