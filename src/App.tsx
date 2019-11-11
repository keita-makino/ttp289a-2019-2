import React from 'react';
import { hot } from 'react-hot-loader';

import Document from './components/Document';
import './App.css';
import 'katex/dist/katex.min.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Document />
    </div>
  );
};

export default hot(module)(App);
