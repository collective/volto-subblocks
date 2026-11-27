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
      // Must match the items of the SortableContext in withDNDContext.
      id: props.data?.id || `subblock-${props.index}`,
      data: {
        type: 'subblock',
        index: props.index,
        onMoveSubblock: props.onMoveSubblock,
      },
    });

    const style = {
      // Only move: subblocks differ in height, and CSS.Transform would
      // scale the dragged one to the size of the one below the pointer.
      transform: CSS.Translate.toString(transform),
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
      // Keep the element's own ref: Subblock uses it to set subblock.node.
      const { ref } = element;
      return React.cloneElement(element, {
        ref: (node) => {
          setNodeRef(node);
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        },
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
