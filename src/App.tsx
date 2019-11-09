import React from 'react';
import { hot } from 'react-hot-loader';

import Document from './components/Document';
import './App.css';
import 'katex/dist/katex.min.css';
import data from './data/data.json';
import regression from './utils/regression';

const App: React.FC = () => {
  regression(data, 'C3H17M');
  return (
    <div className="App">
      <Document />
    </div>
  );
};

export default hot(module)(App);
