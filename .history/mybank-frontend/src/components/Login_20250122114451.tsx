// Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api"; // Assurez-vous de définir loginUser pour gérer l'authentification

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await loginUser({ email, password });
    if (response.token) {
      localStorage.setItem("token", response.token); // Sauvegarder le token dans le localStorage
      navigate("/operations"); // Rediriger vers la page des opérations
    } else {
      alert("Échec de la connexion");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 mb-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 mb-4"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2">
        Login
      </button>
    </div>
  );
};

export default Login;
