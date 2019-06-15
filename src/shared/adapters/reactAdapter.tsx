import React from 'react';
import ReactDOM from 'react-dom';

import { Store } from 'shared/state-manager';

export const reactAdapter = function<P>(
  el: HTMLElement,
  propsStore: Store<any, P>,
  Component: React.ComponentType<P>
): Function {
  ReactDOM.render(<Component {...propsStore.getTransformedState()} />, el);
  return propsStore.subscribe(props => {
    ReactDOM.render(<Component {...props} />, el);
  });
};
