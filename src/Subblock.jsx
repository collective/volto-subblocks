import React from 'react'
import cx from 'classnames'

const Subblock = ({ className, draggable = true, children, subblock }) => {
  let ret = (
    <div
      className={cx(
        'single-block',
        draggable ? 'subblock-draggable' : '',
        draggable
          ? {
              isDragging: subblock.isDragging,
            }
          : null,
        className,
      )}
      onFocus={subblock.onFocus}
      ref={(_node) => {
        subblock.node = _node
      }}
    >
      {subblock.renderDNDButton()}
      {subblock.renderDeleteButton()}
      {children}
    </div>
  )

  if (draggable) {
    if (subblock.props.connectDropTarget && subblock.props.connectDragPreview) {
      return subblock.props.connectDropTarget(subblock.props.connectDragPreview(ret))
    }
  }

  return ret
}

export default Subblock
