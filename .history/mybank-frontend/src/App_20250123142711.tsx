// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import OperationList from "./components/OperationList";
import CreateOperation from "./components/CreateOperation";
import EditOperation from "./components/EditOperation";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/operations" element={<OperationList />} />
        <Route path="/create-operation" element={<CreateOperation />} />
        <Route path="/edit-operation/:id" element={<EditOperation />} />
        <Route path="/" element={<div>Welcome to MyBank!</div>} />
      </Routes>
    </Router>
  );
};

export default App;