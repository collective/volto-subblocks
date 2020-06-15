import React from 'react'
import cx from 'classnames'

const Subblock = ({
  className,
  draggable = true,
  children,
  onFocus,
  isDragging,
  node,
  connectDropTarget,
  connectDragPreview,
}) => {
  let ret = (
    <div
      className={cx(
        'single-block',
        draggable ? 'subblock-draggable' : '',
        draggable
          ? {
              isDragging: isDragging,
            }
          : null,
        className,
      )}
      onFocus={onFocus}
      ref={(_node) => {
        node = _node
      }}
    >
      {children}
    </div>
  )

  if (draggable) {
    return connectDropTarget(connectDragPreview(ret))
  }
  return ret
}

export default Subblock
