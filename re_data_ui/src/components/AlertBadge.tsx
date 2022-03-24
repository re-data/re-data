import React, { PropsWithChildren, ReactElement } from 'react';

interface AlertBadgeProps {
  label: string;
}

const AlertBadge: React.FC<AlertBadgeProps> = (
  props: PropsWithChildren<AlertBadgeProps>,
): ReactElement => {
  const { label } = props;
  let classNames = 'badge rounded-full px-2.5 pt-1 pb-1.5 text-center object-right-top text-white text-xs mr-3';
  if (label === 'anomalies' || label === 'anomaly') {
    classNames += ' bg-secondary';
  } else if (label === 'schema_changes') {
    classNames += ' bg-yellow-300';
  } else if (label === 'test_failure') {
    classNames += ' bg-red-500';
  }
  return (
    <span className={classNames}>
      {label?.split('_')?.join(' ')?.toString()}
    </span>
  );
};

export default AlertBadge;
