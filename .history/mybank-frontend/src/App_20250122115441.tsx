import React from 'react';
import './App.css';
import Login from './components/Login';
import CreateOperation from './components/CreateOperation';
import OperationList from './components/OperationList';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>MyBank</h1>
      <Login />
      <CreateOperation />
      <OperationList />
    </div>
  );
};

export default App;
