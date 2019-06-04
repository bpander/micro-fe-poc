import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { scan, startWith } from 'rxjs/operators';

export interface Next<T> {
  (setter: Setter<T>): void;
}

export interface Store<T> {
  next: Next<T>;
  pipe: Observable<T>['pipe'];
}

export interface Setter<T> {
  (state: T): T;
}

// TODO: Get this from a library
const identity = <T>(thing: T): T => thing;

export const createStore = <T>(initialState: T): Store<T> => {
  const subject = new Subject<Setter<T>>();
  const reducer = (acc: T, setter: Setter<T>) => setter(acc);
  const stream = subject.pipe(
    startWith(identity),
    scan(reducer, initialState),
  );
  return { next: subject.next.bind(subject), pipe: stream.pipe.bind(stream) };
};
