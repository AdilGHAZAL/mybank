// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Navbar for navigation
import Login from "./components/Login"; // Login page
import OperationList from "./components/OperationList"; // List of operations
import CreateOperation from "./components/CreateOperation"; // Create operation form

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/operations" element={<OperationList />} />
        <Route path="/create-operation" element={<CreateOperation />} />
        <Route path="/" element={<div>Welcome to MyBank!</div>} />
      </Routes>
    </Router>
  );
};

export default App;