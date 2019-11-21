import React from 'react';

type Props = React.PropsWithChildren<{ section: number }>;

const ComponentWrapper: React.FC<Props> = (props: Props) => {
  return <>{props.children}</>;
};

export default ComponentWrapper;
