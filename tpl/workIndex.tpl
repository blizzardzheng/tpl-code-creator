import React from 'react';
import useComponentProps from './props';
import { __COMPONRNT_NAME__ } from __COMPONRNT_PATH__;
__IPROPS__

export default () => {
  const props = useComponentProps('default') as IProps;
  return (
    <div>
      <__COMPONRNT_NAME__ {...props} />
    </div>
  );
};
