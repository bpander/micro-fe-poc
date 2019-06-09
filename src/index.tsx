import { Setter, createStore, mapStore, composeStore } from 'shared/state-manager';
import 'index.css';

const add = (n: number): Setter<number> => s => s + n;
const addName = (name: string): Setter<string[]> => s => [ ...s, name ];
const priceStore = createStore(1);
const mappedStore = mapStore(priceStore, n => '$' + n.toFixed(2));
const nameStore = createStore([ 'phil' ]);
const compoundStore = composeStore({ mapped: mappedStore, name: nameStore });

mappedStore.subscribe(s => console.log('mappedStore', s));
priceStore.subscribe(s => console.log('priceStore', s));
compoundStore.subscribe(s => console.log('compoundStore', s));

const test = () => {
  console.log('=== dispatch mappedStore');
  mappedStore.dispatch(add(1));

  console.log('=== dispatch priceStore');
  priceStore.dispatch(add(1));

  console.log('=== dispatch compoundStore');
  compoundStore.dispatch(s => ({ ...s, name: addName('lkj')(s.name) }));

  console.log('=== dispatch byKey');
  compoundStore.dispatch({ name: addName('abc') });
};
test();
