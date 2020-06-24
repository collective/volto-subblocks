import React from 'react';
import cx from 'classnames';

const SubblocksWrapper = ({ className, children, node }) => {
  return (
    <div
      className={cx('volto-subblocks-wrapper', className)}
      ref={(_node) => {
        node = _node;
      }}
    >
      {children}
    </div>
  );
};

export default SubblocksWrapper;
