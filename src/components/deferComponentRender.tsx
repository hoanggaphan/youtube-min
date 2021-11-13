import hoistStatics from 'hoist-non-react-statics';
import React from 'react';

type MyProps = any;
type MyState = {
  shouldRender: boolean; // like this
};

/**
 * Allows two animation frames to complete to allow other components to update
 * and re-render before mounting and rendering an expensive `WrappedComponent`.
 */
export default function deferComponentRender(WrappedComponent: any) {
  class DeferredRenderWrapper extends React.Component<MyProps, MyState> {
    constructor(props: MyProps) {
      super(props);
      this.state = { shouldRender: false };
    }

    componentDidMount() {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() =>
          this.setState({ shouldRender: true })
        );
      });
    }

    render() {
      return this.state.shouldRender ? (
        <WrappedComponent {...this.props} />
      ) : "Loading...";
    }
  }

  return hoistStatics(DeferredRenderWrapper, WrappedComponent);
}
