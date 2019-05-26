import React from 'react';
import ReactDOM from 'react-dom';
import { BaseContainer } from 'conductor/BaseContainer';

import { ProductDetailContainer } from 'product/containers/ProductDetailContainer';

export class XApp extends BaseContainer {
  static tagName = 'x-app';
  render() {
    ReactDOM.render(
      <ProductDetailContainer.tagName />,
      this,
    );
  }
}
customElements.define(XApp.tagName, XApp);
