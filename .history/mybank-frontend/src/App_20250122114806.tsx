// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar"; // Assurez-vous d'avoir la navbar pour la navigation
import Login from "./Login"; // Page de connexion
import OperationList from "./OperationList"; // Liste des opérations
import CreateOperation from "./CreateOperation"; // Créer une opération

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
