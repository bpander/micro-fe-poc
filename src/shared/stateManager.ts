import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { scan, startWith } from 'rxjs/operators';

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

export const createStore = <T>(initialState: T): Store<T> => {
  const subject = new Subject<Setter<T>>();
  const reducer = (acc: T, setter: Setter<T>) => setter(acc)
  const stream = subject.pipe(
    scan(reducer),
    startWith(initialState),
  );
  return { next: subject.next, stream };
};
