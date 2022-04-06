import React, { PropsWithChildren, ReactElement } from 'react';

interface AlertBadgeProps {
  label: string;
}

const AlertBadge: React.FC<AlertBadgeProps> = (
  props: PropsWithChildren<AlertBadgeProps>,
): ReactElement => {
  const { label } = props;
  let classNames = 'badge rounded-full px-4 pt-1 pb-1.5 text-center object-right-top text-white text-xs w-80 mr-3';
  if (label === 'anomalies' || label === 'anomaly') {
    classNames += ' bg-secondary';
  } else if (label === 'schema') {
    classNames += ' bg-yellow-300';
  } else if (label === 'test') {
    classNames += ' bg-red-500';
  }
  return (
    <div className={classNames}>
      {label?.split('_')?.join(' ')}
    </div>
  );
};

export default AlertBadge;
