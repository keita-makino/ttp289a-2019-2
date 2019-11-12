import React from 'react';
import { Box } from '@material-ui/core';

const GetImage = (props: any) => {
  return (
    <Box display={'flex'}>
      <Box>
        <img src={props.image} alt={''} />
        <br />
        <b>{props.text}</b>
      </Box>
    </Box>
  );
};

export default GetImage;
