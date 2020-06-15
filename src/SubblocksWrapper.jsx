import React from 'react'
import cx from 'classnames'

const SubblocksWrapper = ({ className, children, _node }) => {
  return (
    <div
      className={cx('volto-subblocks-wrapper', className)}
      ref={(node) => {
        _node = node
      }}
    >
      {children}
    </div>
  )
}

export default SubblocksWrapper
