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
  dispatch: Dispatch<T>;
  subscribe: (listener: (newState: U) => void) => Unsubscribe;
}

const byKey = <T>(state: T, setters: { [K in keyof T]?: Setter<T[K]> }): T => {
  const keys = Object.keys(setters) as Array<keyof typeof setters>;
  return keys.reduce(
    (acc, key) => Object.assign(acc, { [key]: setters[key]!(state[key]) }),
    { ...state },
  );
};

export const createStore = <T>(initialState: T, ...middleware: Middleware<T>[]): Store<T> => {
  let state: T = middleware.reduce((s, m) => m(s), initialState);
  const listeners: Listener<T>[] = [];

  const getState = () => state;
  const dispatch = (setters: Setter<T> | { [K in keyof T]?: Setter<T[K]> }) => {
    const newState = (typeof setters === 'function')
      ? setters(state)
      : byKey(state, setters);
    const prevState = state;
    if (newState !== prevState) {
      state = middleware.reduce((s, m) => m(s, prevState), newState);
      listeners.forEach(listener => listener(state));
    }
  };
  const subscribe = (listener: Listener<T>): Unsubscribe => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };

  return { getState, dispatch, subscribe };
};

export const mapStore = <T, U>(store: Store<T>, map: (state: T) => U): Store<T, U> => {
  const subscribe = (listener: Listener<U>) => {
    return store.subscribe(state => listener(map(state)));
  };
  return { ...store, subscribe };
};

export const composeStore = <T, U extends { [K in keyof T]: any }>(stores: { [K in keyof T]: Store<T[K], U[K]> }): Store<T, U> => {
  const keys = Object.keys(stores) as Array<keyof typeof stores>;
  const getState = () => keys.reduce((acc, key) => Object.assign(acc, { [key]: stores[key].getState() }), {}) as U;
  const dispatch = (setters: Setter<T> | { [K in keyof T]?: Setter<T[K]> }) => {
    const newState = (typeof setters === 'function')
      ? setters(getState())
      : byKey(getState(), setters);
    keys.forEach(key => {
      stores[key].dispatch(() => newState[key]);
    });
  };
  const subscribe = (listener: Listener<U>) => {
    const subscriptions = keys.map(key => stores[key].subscribe(newState => {
      listener({ ...getState(), [key]: newState });
    }));
    return () => subscriptions.forEach(unsubscribe => unsubscribe());
  };
  return { getState, subscribe, dispatch };
};
