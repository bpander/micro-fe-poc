import { Setter, createStore, mapStore, composeStore, Dispatch } from 'shared/state-manager';
import 'index.css';

const add = (n: number): Setter<number> => s => s + n;
const addName = (name: string): Setter<string[]> => s => [ ...s, name ];
const priceStore = createStore(1);
const mappedStore = mapStore(priceStore, n => '$' + n.toFixed(2));
const nameStore = createStore([ 'phil' ]);
const compoundStore = composeStore({ mapped: mappedStore, name: nameStore });
const dispatch: Dispatch<{ mapped: number; name: string[] }> = compoundStore.dispatch;

mappedStore.subscribe(s => console.log('mappedStore', s));
priceStore.subscribe(s => console.log('priceStore', s));
compoundStore.subscribe(s => console.log('compoundStore1', s));
compoundStore.subscribe(s => console.log('compoundStore2', s));

let i = 0;
const test = () => {
  console.log('TEST #' + ++i);
  console.log('=== dispatch mappedStore');
  mappedStore.dispatch(add(1));

  console.log('=== dispatch priceStore');
  priceStore.dispatch(add(1));

  console.log('=== dispatch compoundStore');
  dispatch(s => ({ ...s, name: addName('lkj')(s.name) }));

  console.log('=== dispatch byKey');
  dispatch({ name: addName('abc'), mapped: add(1) });
  console.log('');
};
test();

setTimeout(test, 0);
