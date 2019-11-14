import React from 'react';
import Cover from '../document/Cover.mdx';
import One from '../document/1.mdx';
import Two from '../document/2.mdx';
import Three from '../document/3.mdx';
import Four from '../document/4.mdx';
import Five from '../document/5.mdx';
import Notes from '../document/Notes.mdx';
import References from '../document/References.mdx';
import { Box } from '@material-ui/core';

type Props = {};

const Document: React.FC<Props> = (props: Props) => {
  return (
    <>
      <Box style={{ height: '10in', display: 'flex' }} alignItems={'center'}>
        <Box>
          <Cover />
        </Box>
      </Box>
      <One />
      <Two />
      <Three />
      <Four />
      <Five />
      <Notes />
      <References />
    </>
  );
};

export default Document;
