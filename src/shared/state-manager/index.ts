export interface Setter<T> {
  (state: T): T;
}

export interface Middleware<T> {
  (state: T, prevState?: T): T;
}

export interface Listener<T> {
  (newState: T): void;
}

export interface Unsubscribe {
  (): void;
}

export interface Dispatch<T> {
  (setter: Setter<T>): void;
  (setters: { [K in keyof T]?: Setter<T[K]> }): void;
}

export interface Store<T, U = T> {
  getState: () => T;
  getTransformedState: () => U;
  dispatch: Dispatch<T>;
  subscribe: (listener: (newState: U) => void) => Unsubscribe;
}

const remove = <T>(arr: T[], item: T): T[] => {
  const indexToRemove = arr.indexOf(item);
  if (indexToRemove === -1) {
    return arr;
  }
  const clone = [ ...arr ];
  clone.splice(indexToRemove, 1);
  return clone;
};

const byKey = <T>(state: T, setters: { [K in keyof T]?: Setter<T[K]> }): T => {
  const keys = Object.keys(setters) as Array<keyof typeof setters>;
  return keys.reduce(
    (acc, key) => Object.assign(acc, { [key]: setters[key]!(state[key]) }),
    { ...state },
  );
};

export const createStore = <T>(initialState: T, ...middleware: Middleware<T>[]): Store<T> => {
  let state: T = middleware.reduce((s, m) => m(s), initialState);
  let nextTick: Promise<void> | null = null;
  let listeners: Listener<T>[] = [];

  const getState = () => state;
  const getTransformedState = getState;
  const dispatch = (setters: Setter<T> | { [K in keyof T]?: Setter<T[K]> }) => {
    const newState = (typeof setters === 'function')
      ? setters(state)
      : byKey(state, setters);
    const prevState = state;
    if (newState !== prevState) {
      state = middleware.reduce((s, m) => m(s, prevState), newState);
      if (!nextTick) {
        nextTick = Promise.resolve().then(() => {
          listeners.forEach(listener => listener(state));
          nextTick = null;
        });
      }
    }
  };
  const subscribe = (listener: Listener<T>): Unsubscribe => {
    listeners = [ ...listeners, listener ];
    return () => {
      listeners = remove(listeners, listener);
    };
  };

  return { getState, getTransformedState, dispatch, subscribe };
};

export const mapStore = <T, U, V>(store: Store<T, U>, map: (state: U) => V): Store<T, V> => {
  const getTransformedState = () => map(store.getTransformedState());
  const subscribe = (listener: Listener<V>) => {
    return store.subscribe(state => listener(map(state)));
  };
  return { ...store, getTransformedState, subscribe };
};

type StoreDict<T, U> =
  & { [K in keyof T]: Store<T[K], any> }
  & { [K in keyof U]: Store<any, U[K]> };

export const composeStore = <T, U>(stores: StoreDict<T, U>): Store<T, U> => {
  const keys = Object.keys(stores) as Array<keyof T>;
  const getState = () => keys.reduce((acc, key) => Object.assign(acc, { [key]: stores[key].getState() }), {}) as T;
  const getTransformedState = () => keys.reduce((acc, key) => Object.assign(acc, { [key]: stores[key].getTransformedState() }), {}) as U;
  const dispatch = (setters: Setter<T> | { [K in keyof T]?: Setter<T[K]> }) => {
    const newState = (typeof setters === 'function')
      ? setters(getState())
      : byKey(getState(), setters);
    keys.forEach(key => {
      stores[key].dispatch(() => newState[key]);
    });
  };
  const subscribe = (listener: Listener<U>) => {
    let nextTick: Promise<void> | null = null;
    const subscriptions = keys.map(key => stores[key].subscribe(() => {
      if (!nextTick) {
        nextTick = Promise.resolve().then(() => {
          listener(getTransformedState());
          nextTick = null;
        });
      }
    }));
    return () => subscriptions.forEach(unsubscribe => unsubscribe());
  };
  return { getState, getTransformedState, subscribe, dispatch };
};
