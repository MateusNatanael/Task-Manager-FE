import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';

import { theme } from './theme/theme';
import { BRAND_CONFIG } from './config/brand.config';
import { api } from './services/api';

export const App: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [backendLatency, setBackendLatency] = useState<number | null>(null);

  // Health check inicial com o backend Task-Manager-BE
  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      const startTime = performance.now();
      try {
        await api.get('/health', { timeout: 3000 });
        if (isMounted) {
          setBackendStatus('online');
          setBackendLatency(Math.round(performance.now() - startTime));
        }
      } catch {
        if (isMounted) {
          setBackendStatus('offline');
        }
      }
    };

    checkBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  const roadmapPhases = [
    {
      phase: 'Etapa 1',
      title: 'Fundação, Vite + MUI & Branding Flexível',
      status: 'Concluída ✅',
      active: true,
      description: 'Setup Vite + React + TS, tema industrial Material UI, centralização do nome fantasia (ALEF) e contratos de API.',
    },
    {
      phase: 'Etapa 2',
      title: 'Autenticação & Controle de Acesso (RBAC)',
      status: 'Próxima 🚀',
      active: false,
      description: 'Tela de login integrada ao JWT, sessão persistida, e proteção de rotas por perfis (MANAGER vs OPERATOR).',
    },
    {
      phase: 'Etapa 3',
      title: 'Shell da Aplicação (Layout, Navbar & Sidebar)',
      status: 'Pendente ⏳',
      active: false,
      description: 'Navegação responsiva, cabeçalho com branding dinâmico ALEF, seletor de unidade e dados do usuário.',
    },
    {
      phase: 'Etapa 4',
      title: 'Gestão de Tarefas & Matriz GUT Dinâmica',
      status: 'Pendente ⏳',
      active: false,
      description: 'Listagem inteligente ordenada por criticidade e formulário com cálculo dinâmico de GUT (G × U × T).',
    },
    {
      phase: 'Etapa 5',
      title: 'Máquina de Estados & Regras de Transição',
      status: 'Pendente ⏳',
      active: false,
      description: 'Fluxo Kanban (RECEIVED → ASSIGNED → IN_PROGRESS → BLOCKED → DONE) com modais de justificativa.',
    },
    {
      phase: 'Etapa 6',
      title: 'Gestão de Ativos Industriais & Métricas',
      status: 'Pendente ⏳',
      active: false,
      description: 'Inventário de equipamentos por categoria/unidade e dashboard com KPIs operacionais.',
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar position="sticky" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2.5,
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                }}
              >
                {BRAND_CONFIG.shortCode}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, color: '#0F172A' }}>
                  {BRAND_CONFIG.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {BRAND_CONFIG.tagline}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Chip
                icon={<WifiTetheringIcon sx={{ fontSize: '1rem !important' }} />}
                label={
                  backendStatus === 'online'
                    ? `Backend Online (${backendLatency}ms)`
                    : backendStatus === 'checking'
                    ? 'Checando Backend...'
                    : 'Backend Local (localhost:3333)'
                }
                color={backendStatus === 'online' ? 'success' : backendStatus === 'checking' ? 'warning' : 'default'}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
              />
              <Chip
                label={`v${BRAND_CONFIG.version}`}
                size="small"
                sx={{ bgcolor: '#E2E8F0', color: '#334155', fontWeight: 600 }}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Hero Section */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, alignItems: { sm: 'center' }, mb: 1.5 }}>
            <Typography variant="h3" component="h1" sx={{ color: '#0F172A' }}>
              Projeto Inicial: {BRAND_CONFIG.name}
            </Typography>
            <Chip
              label="Configuração Modular Pronta"
              color="primary"
              size="small"
              sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
            />
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 750, fontSize: '1.05rem' }}>
            Base estruturada com <strong>Vite</strong>, <strong>React</strong>, <strong>TypeScript</strong> e{' '}
            <strong>Material UI</strong>. O nome fantasia <strong>{BRAND_CONFIG.name}</strong> é totalmente
            desacoplado e configurável de forma centralizada.
          </Typography>
        </Box>

        {/* Brand Name Customization Info Box */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 5,
            borderRadius: 3,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderLeft: '6px solid #2563EB',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { md: 'center' } }}>
            <Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                <SettingsOutlinedIcon sx={{ color: '#2563EB', fontSize: 22 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  Como alterar o Nome Fantasia a qualquer momento:
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                O nome <strong>{BRAND_CONFIG.name}</strong> está centralizado. Basta editar a variável{' '}
                <code>VITE_APP_BRAND_NAME</code> no arquivo <code>.env</code> ou modificar{' '}
                <code>src/config/brand.config.ts</code>. Toda a interface atualiza automaticamente!
              </Typography>
            </Box>
            <Chip
              label="Configuração Centralizada ✅"
              variant="filled"
              sx={{ bgcolor: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}
            />
          </Box>
        </Paper>

        {/* Roadmap Cards Grid */}
        <Typography variant="h5" sx={{ mb: 2.5, fontWeight: 700, color: '#0F172A' }}>
          🗺️ Roadmap Gradual de Implementação
        </Typography>

        <Grid container spacing={2.5} sx={{ mb: 6 }}>
          {roadmapPhases.map((item, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: item.active ? '#2563EB' : '#E2E8F0',
                  boxShadow: item.active ? '0 8px 24px -4px rgba(37, 99, 235, 0.12)' : undefined,
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: item.active ? '#2563EB' : 'text.secondary' }}>
                      {item.phase}
                    </Typography>
                    <Chip
                      label={item.status}
                      size="small"
                      color={item.active ? 'primary' : 'default'}
                      variant={item.active ? 'filled' : 'outlined'}
                      sx={{ fontSize: '0.75rem', fontWeight: 600 }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 1, color: '#0F172A' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Test Credentials Box */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ color: '#0F172A' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Credenciais Rápidas de Teste (Backend Seed)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  Utilize estas contas para validar os perfis de acesso na próxima etapa de Autenticação:
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Carlos Gerente (MANAGER)
                      </Typography>
                      <Chip label="Criação & Atribuição" size="small" color="success" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                      manager@taskmanager.com | Senha: 123456
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        João Operador (OPERATOR)
                      </Typography>
                      <Chip label="Apenas Execução" size="small" color="default" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                      operator@taskmanager.com | Senha: 123456
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <SpeedIcon sx={{ color: '#2563EB' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Design System & Tokens de Criticidade
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Cores calibradas para a Matriz de Prioridade GUT e Status da Operação:
                </Typography>

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip label="ALTA (Score ≥ 80)" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary">
                      Risco iminente / Parada de linha
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip label="MÉDIA (30 ≤ Score < 80)" sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary">
                      Atenção / Desgaste moderado
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip label="BAIXA (Score < 30)" sx={{ bgcolor: '#D1FAE5', color: '#059669', fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary">
                      Manutenção preventiva de rotina
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Status do fluxo:{' '}
                  <code>RECEIVED</code> → <code>ASSIGNED</code> → <code>IN_PROGRESS</code> → <code>BLOCKED</code> →{' '}
                  <code>DONE</code>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
