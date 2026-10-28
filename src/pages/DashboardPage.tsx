import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  Paper,
  Button,
  LinearProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { BRAND_CONFIG } from '../config/brand.config';

export const DashboardPage: React.FC = () => {
  const { user, canCreateTask, canAssignTask, canManageEquipment } = useAuth();
  const navigate = useNavigate();

  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [backendLatency, setBackendLatency] = useState<number | null>(null);

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
      completed: true,
      active: false,
      items: [
        'Setup inicial Vite + React + TypeScript',
        'Tema Industrial Material UI customizado (Inter, paleta Slate & tokens GUT)',
        'Marca flexível centralizada em brand.config.ts (Nome fantasia ALEF)',
        'Instância Axios configurada com Bearer Token e interceptor de 401',
        'Tipagens TypeScript de contratos do backend',
      ],
    },
    {
      phase: 'Etapa 2',
      title: 'Autenticação & Controle de Acesso (RBAC)',
      status: 'Concluída ✅',
      completed: true,
      active: false,
      items: [
        'AuthContext com persistência de token JWT e reatividade a 401',
        'Tela de Login (LoginPage) com identidade visual e atalhos de teste (Gerente e Operador)',
        'Proteção de rotas com ProtectedRoute e redirecionamento por perfil',
        'Controle granular de permissões por cargo (canCreateTask, canAssignTask, canManageEquipment)',
      ],
    },
    {
      phase: 'Etapa 3',
      title: 'Shell da Aplicação (Layout, Navbar & Sidebar)',
      status: 'Próxima 🚀',
      completed: false,
      active: true,
      items: [
        'Sidebar retrátil com navegação contextual baseada nas permissões do usuário',
        'Seletor global de Unidade Operacional (/api/units)',
        'Header aprimorado com notificações e breadcrumbs',
        'Estrutura de layout responsivo (Desktop e Mobile)',
      ],
    },
    {
      phase: 'Etapa 4',
      title: 'Gestão de Tarefas & Matriz GUT Dinâmica',
      status: 'Pendente ⏳',
      completed: false,
      active: false,
      items: [
        'Listagem de Ordens de Serviço ordenada por prioridade (priorityScore DESC)',
        'Badges dinâmicos de criticidade (🔴 HIGH >= 80, 🟡 MEDIUM 30-79, 🟢 LOW < 30)',
        'Formulário/Modal de Nova Tarefa com cálculo dinâmico de GUT (G × U × T)',
        'Filtros avançados por Unidade, Status e Responsável',
      ],
    },
    {
      phase: 'Etapa 5',
      title: 'Máquina de Estados & Regras de Transição',
      status: 'Pendente ⏳',
      completed: false,
      active: false,
      items: [
        'Transições de ciclo de vida (RECEIVED → ASSIGNED → IN_PROGRESS → BLOCKED → DONE)',
        'Modal de bloqueio com validação de justificativa (min 10 car.) e anexo de evidência',
        'Modal de desbloqueio com justificativa de resolução',
        'Histórico e linha do tempo de alterações (/api/tasks/:id/history)',
      ],
    },
    {
      phase: 'Etapa 6',
      title: 'Gestão de Ativos Industriais & Métricas',
      status: 'Pendente ⏳',
      completed: false,
      active: false,
      items: [
        'Inventário de equipamentos categorizados (Elétrica, Mecânica, Infra, etc.)',
        'Dashboard executivo de KPIs (/api/tasks/metrics) com Lead Time e Taxa de Bloqueio',
        'Acompanhamento de equipamentos mais acionados',
      ],
    },
  ];

  const completedCount = roadmapPhases.filter((p) => p.completed).length;
  const progressPercent = Math.round((completedCount / roadmapPhases.length) * 100);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Chip
                label="Painel de Controle"
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  mb: 1.5,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Olá, {user?.name || 'Operador'}!
              </Typography>
              <Typography variant="body1" sx={{ color: '#94A3B8', maxWidth: 600 }}>
                Você está autenticado no {BRAND_CONFIG.name}. Abaixo está o status operacional em tempo real do sistema e o checklist de evolução do projeto.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Progresso Geral do Sistema
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 0.5, color: '#38BDF8' }}>
                  {progressPercent}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressPercent}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#38BDF8',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#CBD5E1', display: 'block', mt: 1 }}>
                  {completedCount} de {roadmapPhases.length} etapas implementadas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Status Indicators Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Backend Status */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: 'center' }}>
                  <WifiTetheringIcon sx={{ color: backendStatus === 'online' ? '#10B981' : '#EF4444' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Status da API Backend
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={
                      backendStatus === 'online'
                        ? 'Backend Conectado (3333)'
                        : backendStatus === 'checking'
                        ? 'Verificando...'
                        : 'Backend Offline'
                    }
                    size="small"
                    color={backendStatus === 'online' ? 'success' : backendStatus === 'checking' ? 'default' : 'error'}
                    sx={{ fontWeight: 600 }}
                  />
                  {backendLatency !== null && backendStatus === 'online' && (
                    <Typography variant="caption" color="text.secondary">
                      {backendLatency}ms
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* User Session & Role */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: 'center' }}>
                  <SecurityIcon sx={{ color: '#2563EB' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Sessão & Perfil Ativo
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`Perfil: ${user?.role || 'N/A'}`}
                    size="small"
                    sx={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    JWT Ativo (7 dias)
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Role Permissions */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: 'center' }}>
                  <SpeedIcon sx={{ color: '#8B5CF6' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Permissões RBAC Ativas
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                  <Chip
                    label={canCreateTask ? 'Criar Tarefas: Sim' : 'Criar: Não'}
                    size="small"
                    color={canCreateTask ? 'primary' : 'default'}
                    sx={{ height: 22, fontSize: '0.7rem' }}
                  />
                  <Chip
                    label={canAssignTask ? 'Atribuir: Sim' : 'Atribuir: Não'}
                    size="small"
                    color={canAssignTask ? 'info' : 'default'}
                    sx={{ height: 22, fontSize: '0.7rem' }}
                  />
                  <Chip
                    label={canManageEquipment ? 'Ativos: Sim' : 'Ativos: Não'}
                    size="small"
                    color={canManageEquipment ? 'success' : 'default'}
                    sx={{ height: 22, fontSize: '0.7rem' }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Checklist & Roadmap Section */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              📋 Checklist & Roadmap de Implementação
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Acompanhamento detalhado das entregas progressivas do sistema {BRAND_CONFIG.name}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/my-tasks')}
            size="small"
          >
            Ver Minhas Tarefas
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          {roadmapPhases.map((phase) => (
            <Grid size={{ xs: 12, md: 6 }} key={phase.phase}>
              <Card
                sx={{
                  height: '100%',
                  borderColor: phase.completed
                    ? '#10B981'
                    : phase.active
                    ? '#2563EB'
                    : '#E2E8F0',
                  borderWidth: phase.completed || phase.active ? 2 : 1,
                  boxShadow: phase.active ? '0 8px 24px rgba(37, 99, 235, 0.12)' : undefined,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {phase.completed ? (
                        <CheckCircleIcon sx={{ color: '#10B981' }} />
                      ) : (
                        <RadioButtonUncheckedIcon sx={{ color: phase.active ? '#2563EB' : '#94A3B8' }} />
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {phase.phase}: {phase.title}
                      </Typography>
                    </Box>
                    <Chip
                      label={phase.status}
                      size="small"
                      color={phase.completed ? 'success' : phase.active ? 'primary' : 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Stack spacing={1}>
                    {phase.items.map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: phase.completed ? '#10B981' : phase.active ? '#2563EB' : '#CBD5E1',
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: phase.completed ? 'text.primary' : phase.active ? '#0F172A' : 'text.secondary',
                            fontWeight: phase.active ? 500 : 400,
                          }}
                        >
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
