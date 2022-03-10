import React, { PropsWithChildren, ReactElement } from 'react';

interface AlertBadgeProps {
  error: boolean
}

const AlertBadge: React.FC<AlertBadgeProps> = (
  props: PropsWithChildren<AlertBadgeProps>,
): ReactElement => {
  const { error } = props;
  let classNames = 'badge mb-3 rounded-full px-2.5 pt-1 pb-1.5 text-center object-right-top text-white text-sm mr-3';
  if (error) {
    classNames += ' bg-red-600';
  } else {
    classNames += ' bg-yellow-300';
  }
  return (
    <span
      className={classNames}
    >
      {error ? 'anomaly' : 'schema change'}
    </span>
  );
};

export default AlertBadge;
