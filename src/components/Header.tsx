import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Chip,
  Button,
  Container,
  Avatar,
  Stack,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BRAND_CONFIG } from '../config/brand.config';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'MANAGER':
        return { bg: '#EFF6FF', color: '#1D4ED8', label: 'Gerente (MANAGER)' };
      case 'ANALYST':
        return { bg: '#F5F3FF', color: '#6D28D9', label: 'Analista (ANALYST)' };
      case 'OPERATOR':
        return { bg: '#ECFDF5', color: '#047857', label: 'Operador (OPERATOR)' };
      case 'SUPERVISOR':
        return { bg: '#FEF3C7', color: '#B45309', label: 'Supervisor (SUPERVISOR)' };
      default:
        return { bg: '#F1F5F9', color: '#475569', label: role || 'Usuário' };
    }
  };

  const roleInfo = getRoleBadgeColor(user?.role);

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
          {/* Brand Logo & Title */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                letterSpacing: '-0.05em',
              }}
            >
              {BRAND_CONFIG.shortCode}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {BRAND_CONFIG.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {BRAND_CONFIG.tagline}
              </Typography>
            </Box>
          </Box>

          {/* Navigation links */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              size="small"
              startIcon={<DashboardOutlinedIcon fontSize="small" />}
              variant={location.pathname === '/dashboard' ? 'contained' : 'text'}
              onClick={() => navigate('/dashboard')}
              sx={{ color: location.pathname === '/dashboard' ? '#FFF' : 'text.primary' }}
            >
              Dashboard & Checklist
            </Button>
            <Button
              size="small"
              startIcon={<AssignmentOutlinedIcon fontSize="small" />}
              variant={location.pathname === '/my-tasks' ? 'contained' : 'text'}
              onClick={() => navigate('/my-tasks')}
              sx={{ color: location.pathname === '/my-tasks' ? '#FFF' : 'text.primary' }}
            >
              Minhas Tarefas
            </Button>
          </Stack>

          {/* User Profile & Logout */}
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: '#2563EB',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {user.name}
                  </Typography>
                  <Chip
                    label={roleInfo.label}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: roleInfo.bg,
                      color: roleInfo.color,
                      mt: 0.25,
                    }}
                  />
                </Box>
              </Box>
            )}

            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<LogoutIcon fontSize="small" />}
              onClick={handleLogout}
              sx={{ borderColor: '#E2E8F0', color: '#64748B' }}
            >
              Sair
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
