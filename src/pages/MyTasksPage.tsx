import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Card,
  CardContent,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { Task } from '../types/api';

export const MyTasksPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Task[]>('/api/tasks/my-tasks');
      setTasks(response.data);
    } catch {
      setError('Não foi possível carregar as tarefas do backend. Verifique se a API está online.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Title */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              size="small"
              sx={{ mb: 1, color: 'text.secondary' }}
            >
              Voltar ao Dashboard & Checklist
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Minhas Ordens de Serviço (Tarefas Atribuídas)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tarefas operacionais sob responsabilidade de {user?.name}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchMyTasks}
            disabled={isLoading}
            size="small"
          >
            Atualizar
          </Button>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              borderColor: '#E2E8F0',
            }}
          >
            <EngineeringIcon sx={{ fontSize: 56, color: '#94A3B8', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Nenhuma tarefa atribuída no momento
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mb: 3 }}>
              As tarefas atribuídas ao seu usuário aparecerão aqui para você iniciar, relatar impedimentos (bloqueios) ou finalizar o ciclo de execução.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Ir para o Painel Geral
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid size={{ xs: 12, md: 6 }} key={task.id}>
                <Card>
                  <CardContent>
                    <Stack direction="row" sx={{ mb: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        OS #{task.seqCode}
                      </Typography>
                      <Chip label={task.status} size="small" />
                    </Stack>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      {task.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Score Prioridade: {task.priorityScore} · Criticidade: {task.criticality}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};
