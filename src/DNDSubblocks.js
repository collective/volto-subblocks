import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const injectDNDSubblocks = (Component) => {
  const DNDSubblocks = (props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props.data?.id || 'subblock-${props.index}',
      data: {
        type: 'subblock',
        index: props.index,
        onMoveSubblock: props.onMoveSubblock,
      },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const connectDragSource = (element) => {
      return React.cloneElement(element, {
        ref: setActivatorNodeRef,
        ...attributes,
        ...listeners,
      });
    };

    const connectDragPreview = (element) => {
      return React.cloneElement(element, {
        ref: setNodeRef,
        style: {
          ...element.props.style,
          ...style,
        },
      });
    };

    const connectDropTarget = (element) => element;

    return (
      <Component
        {...props}
        isDragging={isDragging}
        connectDragSource={connectDragSource}
        connectDragPreview={connectDragPreview}
        connectDropTarget={connectDropTarget}
      />
    );
  };

  return DNDSubblocks;
};
