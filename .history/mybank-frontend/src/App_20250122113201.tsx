import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import CreateOperation from './components/CreateOperation';
import OperationList from './components/OperationList';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <h1>MyBank</h1>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-operation" element={<CreateOperation />} />
          <Route path="/operation-list" element={<OperationList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
