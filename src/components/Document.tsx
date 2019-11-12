import React from 'react';
import One from '../document/1.mdx';
import Two from '../document/2.mdx';
import Three from '../document/3.mdx';
import Four from '../document/4.mdx';

type Props = {};

const Document: React.FC<Props> = (props: Props) => {
  return (
    <>
      <One />
      <Two />
      <Three />
      <Four />
    </>
  );
};

export default Document;
