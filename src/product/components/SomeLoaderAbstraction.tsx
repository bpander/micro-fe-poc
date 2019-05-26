import React from 'react';

interface SomeLoaderAbstractionProps {
  fetchData: () => Promise<void>;
  needsData: boolean;
  fallback: JSX.Element;
  alwaysFetchOnMount?: boolean;
}

export class SomeLoaderAbstraction extends React.Component<SomeLoaderAbstractionProps> {
  componentDidMount() {
    if (this.props.needsData || this.props.alwaysFetchOnMount) {
      this.props.fetchData();
    }
  }
  componentDidUpdate(prevProps: SomeLoaderAbstractionProps) {
    if (this.props.needsData && !prevProps.needsData) {
      this.props.fetchData();
    }
  }
  render() {
    if (this.props.needsData) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
