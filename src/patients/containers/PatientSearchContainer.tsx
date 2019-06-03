import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, startWith, filter, tap, catchError } from 'rxjs/operators';
import React, { useEffect } from 'react';

interface Toast {
  message: string;
}

interface Patient {
  name: string;
}

interface SearchResult<T> {
  results: T[];
  totalResults: number;
}

enum ActionStatusType {
  None = 'None',
  Loading = 'Loading',
  Loaded = 'Loaded',
  Error = 'Error',
}

type ActionStatus<T, R = void, E = Error> =
  | { status: ActionStatusType.None }
  | { status: ActionStatusType.Loading, request: T, force?: boolean }
  | { status: ActionStatusType.Loaded, request: T, response: R }
  | { status: ActionStatusType.Error, request: T, error: E }

interface Router {
  location: string;
  action: 'pop' | 'push' | 'replace';
}

const searchPatientsWith = (stream: BehaviorSubject<SearchResult<Patient>>) => {
  const subject = new BehaviorSubject<ActionStatus<string, SearchResult<Patient>>>({ status: ActionStatusType.None });
  return subject;
};

const loadWith = function<T, R, E>(stream: BehaviorSubject<ActionStatus<T, R, E>>) {
  const load = (request: T) => {
    stream.next({ status: ActionStatusType.Loading, request });
  };
  return load;
}

const clearLoader = function<T, R, E>(stream: BehaviorSubject<ActionStatus<T, R, E>>) {
  stream.next({ status: ActionStatusType.None });
}

const addToastWith = (stream: BehaviorSubject<Toast[]>) => (toast: Toast) => {

};



interface PatientSearchProps {
  patientSearchState: ActionStatus<string, SearchResult<Patient>>;
}

interface PatientSearchState {
  name: string;
}

const renderWith = (
  toastsSource: BehaviorSubject<Toast[]>,
  routerSource: BehaviorSubject<Router>,
  patientSearchSource: BehaviorSubject<ActionStatus<string, SearchResult<Patient>>>,
) => {
  const addToast = addToastWith(toastsSource);
  class PatientSearch extends React.Component<PatientSearchProps, PatientSearchState> {

    static getToast(status: ActionStatusType) {
      switch (status) {
        case ActionStatusType.Error: return { message: 'oh no!' };
        case ActionStatusType.Loaded: return { message: 'oh yes!' };
      }
    }

    componentDidUpdate(prevProps: PatientSearchProps) {
      const { patientSearchState } = this.props;
      if (patientSearchState.status !== prevProps.patientSearchState.status) {
        const toast = PatientSearch.getToast(patientSearchState.status);
        if (toast) {
          addToast(toast);
        }
      }
    }

    onSubmit: React.FormEventHandler = e => {
      e.preventDefault();
      loadWith(patientSearchSource)(this.state.name);
    };

    render() {
      const { props } = this;
      return (
        <div>
          <form onSubmit={this.onSubmit}>
            <input value={this.state.name} />
            <button disabled={props.patientSearchState.status === ActionStatusType.Loading}>
              search
            </button>
          </form>
          {(props.patientSearchState.status === ActionStatusType.Loaded) && (
            <ul>
              {props.patientSearchState.response.results.map(r => (
                <li>
                  {r.name}
                  <button onClick={() => routerSource.next({ action: 'push', location: ''})}>edit</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  };
  return (props: PatientSearchProps) => <PatientSearch {...props} />;
};

const onConnected = (el: HTMLElement, attributes: Observable<{}>) => {
  const patientsSource = new BehaviorSubject<SearchResult<Patient>>({ results: [], totalResults: 0 });
  const toastsSource = new BehaviorSubject<Toast[]>([]);
  const routerSource = new BehaviorSubject<Router>({ action: 'pop', location: '' });

  const searchPatientsStatusSource = searchPatients(patientsSource);
  const propsSource = listenTo({
    searchPatientsStatus: searchPatientsStatusSource,
  });

  return propsSource.pipe(
    map(props => (
      <PatientSearch
        {...props}
        nextRouter={routerSource.next}
        nextToasts={toastsSource.next}
        nextSearchPatientsStatus={searchPatientsStatusSource.next}
      />
    )),
  );

  return propsSource.pipe(
    map(renderWith(toastsSource, routerSource, searchPatientsStatusSource)),
  );
};
