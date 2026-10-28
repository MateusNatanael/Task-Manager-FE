import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BRAND_CONFIG } from '../config/brand.config';
import axios from 'axios';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Se já estiver logado, redireciona
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const destination = user.role === 'OPERATOR' ? '/my-tasks' : '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor, informe o e-mail e a senha.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      // Redireciona para onde o usuário tentou ir originalmente ou pelo perfil
      const stateFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
      navigate(stateFrom || '/dashboard', { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setErrorMessage(err.response.data.message);
        } else if (err.code === 'ECONNABORTED' || err.message?.includes('Network Error')) {
          setErrorMessage('Não foi possível conectar ao servidor do backend. Verifique se o Task-Manager-BE está ativo na porta 3333.');
        } else {
          setErrorMessage(`Erro ao realizar login (Código: ${err.response?.status || 'desconhecido'}).`);
        }
      } else {
        setErrorMessage('Ocorreu um erro inesperado ao tentar efetuar login.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setErrorMessage(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        p: { xs: 2, sm: 4 },
      }}
    >
      <Box sx={{ maxWidth: 460, width: '100%' }}>
        {/* Brand Header */}
        <Stack spacing={1.5} sx={{ mb: 3.5, textAlign: 'center', alignItems: 'center' }}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 3,
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.6rem',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
              letterSpacing: '-0.05em',
            }}
          >
            {BRAND_CONFIG.shortCode}
          </Box>
          <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
            {BRAND_CONFIG.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 360 }}>
            {BRAND_CONFIG.tagline}
          </Typography>
        </Stack>

        {/* Login Card */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#FFFFFF',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Acesso ao Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Digite suas credenciais corporativas para continuar
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  id="email"
                  label="E-mail"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="exemplo@taskmanager.com"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  id="password"
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    py: 1.4,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    backgroundColor: '#0F172A',
                    '&:hover': {
                      backgroundColor: '#1E293B',
                    },
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                  ) : (
                    'Entrar na Plataforma'
                  )}
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Chip label="Credenciais de Teste (Seed)" size="small" sx={{ fontSize: '0.72rem' }} />
            </Divider>

            {/* Quick Fill Test Accounts */}
            <Stack spacing={1.5}>
              <Paper
                variant="outlined"
                onClick={() => handleQuickFill('manager@taskmanager.com', '123456')}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderColor: email === 'manager@taskmanager.com' ? 'primary.main' : '#E2E8F0',
                  backgroundColor: email === 'manager@taskmanager.com' ? '#F1F5F9' : '#FAFAFA',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: '#F8FAFC',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SupervisorAccountIcon sx={{ color: '#2563EB' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Carlos Gerente (MANAGER)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      manager@taskmanager.com · Senha: 123456
                    </Typography>
                  </Box>
                </Box>
                {email === 'manager@taskmanager.com' && (
                  <CheckCircleIcon fontSize="small" color="primary" />
                )}
              </Paper>

              <Paper
                variant="outlined"
                onClick={() => handleQuickFill('operator@taskmanager.com', '123456')}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderColor: email === 'operator@taskmanager.com' ? 'primary.main' : '#E2E8F0',
                  backgroundColor: email === 'operator@taskmanager.com' ? '#F1F5F9' : '#FAFAFA',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: '#F8FAFC',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EngineeringIcon sx={{ color: '#059669' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      João Operador (OPERATOR)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      operator@taskmanager.com · Senha: 123456
                    </Typography>
                  </Box>
                </Box>
                {email === 'operator@taskmanager.com' && (
                  <CheckCircleIcon fontSize="small" color="primary" />
                )}
              </Paper>
            </Stack>
          </CardContent>
        </Card>

        {/* Footer */}
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: '#64748B' }}>
          {BRAND_CONFIG.copyright} · v{BRAND_CONFIG.version}
        </Typography>
      </Box>
    </Box>
  );
};
