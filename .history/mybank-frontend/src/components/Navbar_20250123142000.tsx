// Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          MyBank
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-blue-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/operations" className="hover:text-blue-300">
              Operations
            </Link>
          </li>
          <li>
            <Link to="/create-operation" className="hover:text-blue-300">
              Create Operation
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-blue-300">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;