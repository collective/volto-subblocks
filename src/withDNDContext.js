import React from 'react';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

let dndContextSingleton = null;
const withDNDContext = (component) => {
  const DNDConnector = (props) => {
    const { DragDropContext } = props.reactDnd;
    const HTML5Backend = props.reactDndHtml5Backend.default;
    if (!dndContextSingleton) {
      dndContextSingleton = DragDropContext(HTML5Backend);
    }

    const DNDSubblocks = React.useMemo(() => dndContextSingleton(component), [
      DragDropContext,
      HTML5Backend,
    ]);

    return <DNDSubblocks {...props} />;
  };
  return injectLazyLibs(['reactDnd', 'reactDndHtml5Backend'])(DNDConnector);
};

export default withDNDContext;
