import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Login</Link>
        </li>
        <li>
          <Link to="/create-operation">Create Operation</Link>
        </li>
        <li>
          <Link to="/operation-list">Operation List</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
