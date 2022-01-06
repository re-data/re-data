import React, { PropsWithChildren, ReactElement } from 'react';

interface EmptyContentProps {
  text: string;
}

const EmptyContent: React.FC<EmptyContentProps> = (
  props: PropsWithChildren<EmptyContentProps>,
): ReactElement => {
  const { text, children } = props;
  return (
    <div className="grid place-items-center">
      {children}
      <span className="text-md mt-2 text--capitalize">{text}</span>
    </div>
  );
};

export default EmptyContent;
