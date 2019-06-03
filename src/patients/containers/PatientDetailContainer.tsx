import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { useRef, useEffect, useState } from 'react';

interface Toast {
  message: string;
}

interface Patient {
  id: string;
  name: string;
}

interface SearchResult<T> {
  results: T[];
  totalResults: number;
}

const makeSuspenseful = function<T>(el: HTMLElement, p: Promise<T>) {
  return p;
};

const fetchPatient = async (stream: BehaviorSubject<SearchResult<Patient>>, id: string) => {
  return {} as any;
};

const updatePatient = (stream: BehaviorSubject<SearchResult<Patient>>) => async (patient: Patient) => {
  return {} as any;
};

const emptyPatient: Patient = { id: '', name: '' };

const addToast = (stream: BehaviorSubject<Toast[]>) => (toast: Toast) => {

};




interface PatientDetailProps {
  patient?: Patient;
  updatePatient: (patient: Patient) => void;
  addToast: (toast: Toast) => void;
}
const PatientDetail: React.FC<PatientDetailProps> = props => {
  const [ patient, setPatient ] = useState(props.patient || emptyPatient);
  const [ submitting, setSubmitting ] = useState(false);

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    setSubmitting(true);
    let message = 'success';
    try {
      await props.updatePatient(patient!);
    } catch {
      message = 'error';
    }
    setSubmitting(false);
    props.addToast({ message });
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setPatient({ ...patient, [e.currentTarget.name]: e.currentTarget.value });
  };

  if (!props.patient) {
    return <div>Patient not found</div>;
  }
  return (
    <div>
      {/* <x-prompt when={patient !== props.patient} message="Are you sure you want to leave?" /> */}
      <h1>{props.patient.name}</h1>
      <form onSubmit={onSubmit}>
        <input name="name" onChange={onChange} />
        <button disabled={submitting}>
          submit
        </button>
      </form>
    </div>
  );
};

const onConnected = (el: HTMLElement, attributes$: BehaviorSubject<{ id: string }>) => {
  const patientSearch$ = new BehaviorSubject<SearchResult<Patient>>({ results: [], totalResults: 0 });
  const toasts$ = new BehaviorSubject<Toast[]>([]);

  const patient$ = combineLatest(attributes$, patientSearch$).pipe(
    map(([ attributes, patientSearch ]) => {
      const patient = patientSearch.results.find(p => p.id === attributes.id);
      if (!patient) {
        makeSuspenseful(el, fetchPatient(patientSearch$, attributes.id));
      }
      return patient;
    }),
  );

  return patient$.pipe(
    map(patient => (
      <PatientDetail
        key={patient && patient.id}
        patient={patient}
        updatePatient={updatePatient(patientSearch$)}
        addToast={addToast(toasts$)}
      />
    )),
  );
};

export { onConnected };
