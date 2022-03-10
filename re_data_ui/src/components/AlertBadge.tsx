import React, { PropsWithChildren, ReactElement } from 'react';

interface AlertBadgeProps {
  error: boolean
}

const AlertBadge: React.FC<AlertBadgeProps> = (
  props: PropsWithChildren<AlertBadgeProps>,
): ReactElement => {
  const { error } = props;
  let classNames = 'badge mb-3 rounded-full px-2 pt-0.5 pb-1.5 text-center object-right-top text-white text-xs mr-3';
  if (error) {
    classNames += ' bg-red-500';
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
