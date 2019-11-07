import React from 'react';
import Document from './components/Document';
import './App.css';
import 'katex/dist/katex.min.css';
import data from './data/data.json';
import logistic from './utils/logistic';

const App: React.FC = () => {
  logistic(data, 'C3H17M');
  return (
    <div className="App">
      <Document />
    </div>
  );
};

export default App;
