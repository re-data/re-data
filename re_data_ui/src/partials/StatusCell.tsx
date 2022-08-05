import React from 'react';
import { CellProps } from '../components/Table';

export const StatusCell = ({ value }: CellProps): JSX.Element => (
  <div
    className={`${value?.toLowerCase()} text-xs font-medium text-center py-1 px-3 rounded-full w-max`}
  >
    {value}
  </div>
);

export default StatusCell;
