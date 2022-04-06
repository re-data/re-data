import React from 'react';
import { Link } from 'react-router-dom';
import { CellProps } from '../components/Table';

const ModelCell = ({ value, row }: CellProps) => {
  const val = value?.split('.');
  const other = val?.splice(0, val?.length - 1)?.join('.');

  const table = val?.pop();
  const tab = row?.values?.type?.toLowerCase() || 'anomaly';

  return (
    <Link
      to={`/graph?model=${value?.toLowerCase()}&tab=${tab}`}
      className="inline-flex flex-col text-blue-700"
    >
      <span className="text-base font-semibold">{table}</span>
      <em className="text-xs">{other}</em>
    </Link>
  );
};

export default ModelCell;
