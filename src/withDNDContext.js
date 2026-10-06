import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

const withDNDContext = (Component) => {
  const DNDComponent = (props) => {
    const items = (props.data?.subblocks || []).map(
      (subblock, index) => subblock.id || 'subblock-${index}',
    );

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    const handleDragEnd = ({ active, over }) => {
      if (!over || active.id === over.id) {
        return;
      }

      const fromIndex = active.data.current?.index;
      const toIndex = over.data.current?.index;
      const onMoveSubblock = active.data.current?.onMoveSubblock;

      if (
        typeof fromIndex === 'number' &&
        typeof toIndex === 'number' &&
        onMoveSubblock
      ) {
        onMoveSubblock(fromIndex, toIndex);
      }
    };

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <Component {...props} />
        </SortableContext>
      </DndContext>
    );
  };

  return DNDComponent;
};

export default withDNDContext;
