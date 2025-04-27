import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;