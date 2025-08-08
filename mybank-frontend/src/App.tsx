// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import new atomic design pages
import Dashboard from "./pages/Dashboard";
import Operations from "./pages/Operations";
import CreateOperation from "./pages/CreateOperation";
import EditOperation from "./pages/EditOperation";
import Categories from "./pages/Categories";
import Analytics from "./pages/Analytics";

// Import authentication components
import Login from "./components/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/operations" element={
          <ProtectedRoute>
            <Operations />
          </ProtectedRoute>
        } />
        
        <Route path="/create-operation" element={
          <ProtectedRoute>
            <CreateOperation />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-operation/:id" element={
          <ProtectedRoute>
            <EditOperation />
          </ProtectedRoute>
        } />
        
        <Route path="/categories" element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;