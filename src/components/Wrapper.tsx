import React, { ReactNode, ReactElement } from 'react';

type Props = React.PropsWithChildren<{}>;

const Wrapper: React.FC<Props> = (props: Props) => {
  React.Children.map(props.children, item =>
    React.Children.map(props.children, item2 => console.log(item2))
  );

  return <>{props.children}</>;
};

export default Wrapper;
