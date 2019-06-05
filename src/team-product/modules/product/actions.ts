import { memoize } from 'lodash';
import { tap } from 'rxjs/operators';

import { Store, Epoch, EpochStatus, createStore } from 'shared/stateManager';
import { Product } from './types';

const simulateLatency = (n: number) => new Promise(r => setTimeout(r, n));

export const fetchProduct = memoize((store: Store<Product[]>): Store<Epoch<string>> => {
  const epochStore = createStore<Epoch<string>>({ type: EpochStatus.None });
  const stream = epochStore.stream.pipe(
    tap(async epoch => {
      console.log('next heard', epoch);
      if (epoch.type === EpochStatus.Loading) {
        await simulateLatency(2000);
        store.next(s => [ ...s, { sku: '', name: 'product ' + s.length } ]);
        epochStore.next(() => ({ type: EpochStatus.Loaded, request: epoch.request }));
      }
    }),
  );
  return { ...epochStore, stream };
});
