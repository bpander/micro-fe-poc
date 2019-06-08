import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { scan, startWith, share } from 'rxjs/operators';

export interface Next<T> {
  (setter: Setter<T>): void;
}

export interface Store<T> {
  next: Next<T>;
  stream: Observable<T>;
}

export interface Setter<T> {
  (state: T): T;
}

export enum EpochStatus {
  None = 'None',
  Loading = 'Loading',
  Loaded = 'Loaded',
  Error = 'Error',
}

export type Epoch<R = void, E = Error> =
  | { type: EpochStatus.None }
  | { type: EpochStatus.Loading, request: R, force: boolean; }
  | { type: EpochStatus.Loaded, request: R }
  | { type: EpochStatus.Error, error: E }

// TODO: Get this from a library
const identity = <T>(thing: T): T => thing;

export const createStore = <T>(initialState: T): Store<T> => {
  const subject = new Subject<Setter<T>>();
  const reducer = (acc: T, setter: Setter<T>) => setter(acc);
  const stream = subject.pipe(
    share(),
    startWith(identity),
    scan(reducer, initialState),
  );
  return { next: subject.next.bind(subject), stream };
};
