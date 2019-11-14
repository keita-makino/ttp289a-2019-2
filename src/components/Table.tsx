import React from 'react';
import {
  Table as TableMui,
  TableHead,
  TableCell,
  TableRow,
  TableBody
} from '@material-ui/core';
import TeX from '@matejmazur/react-katex';

const getHypothesis = (variable: string) => {
  return <TeX math={`H_\\text{${variable}}`} />;
};

const Table: React.FC = () => {
  return (
    <TableMui size="small">
      <TableHead>
        <TableRow style={{ backgroundColor: '#AAAAAA' }}>
          <TableCell colSpan={2}>
            <b>Table 13. Hypotheses about the Variables</b>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Hypothesis</TableCell>
          <TableCell>Result</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('CHILDLT6')}</TableCell>
          <TableCell>
            <TeX math={'i_F'} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('EFACT1')}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('EFACT7')}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('COMMTIME')}</TableCell>
          <TableCell>
            <TeX math={'iv'} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('EFACT9')}</TableCell>
          <TableCell>
            <TeX math={'i_F'} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('MANDPRV')}</TableCell>
          <TableCell>*</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('UNAWARE')}</TableCell>
          <TableCell>*</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('JOBHOME')}</TableCell>
          <TableCell>
            <TeX math={'ii_M'} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('MANCONST')}</TableCell>
          <TableCell>
            <TeX math={'iv'} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('JOBCONST')}</TableCell>
          <TableCell>
            <TeX math={'i_F'} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('TECHCONS')}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{getHypothesis('CSO9FT2')}</TableCell>
          <TableCell>
            <TeX math={'i_M'} />
          </TableCell>
        </TableRow>
        <TableRow style={{ backgroundColor: '#DDDDDD' }}>
          <TableCell colSpan={2}>
            "*": Omitted before making the first model <br />
            "-": Not significant in both models <br />
            <TeX math={'i_M'} />: Only significant in male model
            <br />
            <TeX math={'i_F'} />: Only significant in female model
            <br />
            <TeX math={'ii_M'} />: Significant in both models, but more than 2x
            important in male model
            <br />
            <TeX math={'iv'} />: Equally significant in bothe models
            <br />
          </TableCell>
        </TableRow>
      </TableBody>
    </TableMui>
  );
};

export default Table;
