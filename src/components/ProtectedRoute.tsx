import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types/api';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasPermission = allowedRoles.includes(user.role);
    if (!hasPermission) {
      // Se não tiver permissão para esta rota específica, redireciona para a rota padrão do seu perfil
      return <Navigate to={user.role === 'OPERATOR' ? '/my-tasks' : '/dashboard'} replace />;
    }
  }

  return <>{children}</>;
};
