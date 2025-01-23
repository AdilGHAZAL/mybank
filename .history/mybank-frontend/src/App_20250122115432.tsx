// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import OperationList from "./OperationList";
import CreateOperation from "./CreateOperation";

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
