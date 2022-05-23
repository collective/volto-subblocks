import React from 'react';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

const ItemTypes = {
  ITEM: 'subblock',
};

const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const itemTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.onMoveSubblock(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

export const injectDNDSubblocks = (component) => {
  const _DNDSubblocksConnector = (props) => {
    const { DropTarget, DragSource } = props.reactDnd;

    const DNDSubblocks = React.useMemo(
      () =>
        DropTarget(ItemTypes.ITEM, itemTarget, (connect, monitor) => ({
          connectDropTarget: connect.dropTarget(),
          highlighted: monitor.canDrop(),
          hovered: monitor.isOver(),
        }))(
          DragSource(ItemTypes.ITEM, itemSource, (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            connectDragPreview: connect.dragPreview(),
            isDragging: monitor.isDragging(),
          }))(component),
        ),
      [DragSource, DropTarget],
    );

    return <DNDSubblocks {...props} />;
  };
  return injectLazyLibs('reactDnd')(_DNDSubblocksConnector);
};
