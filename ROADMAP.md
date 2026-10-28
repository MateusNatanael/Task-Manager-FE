# 🗺️ Roadmap & Checklist de Implementação - ALEF Task Manager

Acompanhamento de entregas graduais e incrementais do frontend industrial **ALEF**.

---

## 📊 Progresso Geral

- [x] **Etapa 1:** Fundação, Vite + MUI & Branding Flexível
- [x] **Etapa 2:** Autenticação & Controle de Acesso (RBAC)
- [ ] **Etapa 3:** Shell da Aplicação (Layout, Navbar & Sidebar)
- [ ] **Etapa 4:** Gestão de Tarefas & Matriz GUT Dinâmica
- [ ] **Etapa 5:** Máquina de Estados & Regras de Transição
- [ ] **Etapa 6:** Gestão de Ativos Industriais & Métricas

---

## 📋 Detalhamento das Etapas

### ✅ Etapa 1: Fundação & Branding Flexível
- [x] Setup inicial com Vite + React 19 + TypeScript.
- [x] Material UI v6 configurado com tema industrial customizado (Inter, paleta Slate, tokens de criticidade GUT).
- [x] Nome fantasia flexível e centralizado (`BRAND_CONFIG` em `src/config/brand.config.ts` e `.env`).
- [x] Instância Axios (`src/services/api.ts`) com `Authorization: Bearer <token>` e interceptor para evento `alef:unauthorized`.
- [x] Tipagens TypeScript completas espelhando contratos de API do backend (`src/types/api.ts`).

---

### ✅ Etapa 2: Autenticação & RBAC (Concluída nesta iteração)
- [x] **`AuthContext` (`src/contexts/AuthContext.tsx`)**:
  - Armazenamento de sessão e token JWT no `localStorage`.
  - Helpers de permissão por perfil de usuário (`hasRole`, `canCreateTask`, `canAssignTask`, `canManageEquipment`).
  - Limpeza automática de sessão ao receber HTTP 401.
- [x] **Tela de Login (`src/pages/LoginPage.tsx`)**:
  - Identidade visual com logotipo/monograma ALEF e slogan.
  - Campos de E-mail e Senha com visibilidade alternável e validações.
  - Botões de **Acesso Rápido para Testes** (Seed):
    - 🔵 Carlos Gerente (`manager@taskmanager.com` / `123456`)
    - 🟢 João Operador (`operator@taskmanager.com` / `123456`)
  - Tratamento de mensagens de erro amigáveis vindas da API ou de conectividade.
- [x] **Controle de Acesso e Rotas (`src/components/ProtectedRoute.tsx`)**:
  - Bloqueio de rotas não autenticadas com redirecionamento para `/login`.
  - Suporte a restrição de cargos (`allowedRoles`).
  - Redirecionamento por perfil (`OPERATOR` $\to$ `/my-tasks`, `MANAGER` $\to$ `/dashboard`).
- [x] **Rotas e Shell Inicial (`src/App.tsx`, `Header.tsx`, `DashboardPage.tsx`, `MyTasksPage.tsx`)**:
  - Roteamento configurado com `react-router-dom`.
  - Topbar com dados do usuário logado, badge de perfil e botão de Logout.

---

### 🚀 Etapa 3: Shell da Aplicação (Layout, Navbar & Sidebar) — *Próxima*
- [ ] Sidebar retrátil / Drawer com navegação hierárquica baseada no perfil ativo.
- [ ] Seletor global de Unidade Operacional (`GET /api/units`) persistido na sessão.
- [ ] Indicador permanente de status da conexão com a API backend (`/health`).
- [ ] Breadcrumbs e cabeçalhos contextuais de página.

---

### ⏳ Etapa 4: Gestão de Tarefas & Matriz GUT Dinâmica
- [ ] Tabela e listagem de Ordens de Serviço ordenada por `priorityScore DESC`.
- [ ] Badges dinâmicos de criticidade: 🔴 HIGH ($\ge 80$), 🟡 MEDIUM ($30\text{--}79$), 🟢 LOW ($< 30$).
- [ ] Modal / Formulário de Criação de Tarefa (`POST /api/tasks`):
  - Sliders numéricos (1 a 5) para Gravidade ($G$), Urgência ($U$) e Tendência ($T$).
  - Cálculo e preview em tempo real de $Score = G \times U \times T$ e classificação da criticidade.
- [ ] Filtros por unidade, status e operador atribuído.

---

### ⏳ Etapa 5: Máquina de Estados & Regras de Transição
- [ ] Painel Kanban com colunas de status: `RECEIVED` $\to$ `ASSIGNED` $\to$ `IN_PROGRESS` $\to$ `BLOCKED` $\to$ `DONE`.
- [ ] Modal de atribuição de responsável (`PATCH /api/tasks/:id/assign`).
- [ ] Modal de Bloqueio de Tarefa (`IN_PROGRESS` $\to$ `BLOCKED`):
  - Justificativa obrigatória (mínimo 10 caracteres).
  - Campo de URL de anexo de evidência.
- [ ] Modal de Desbloqueio (`BLOCKED` $\to$ `IN_PROGRESS`):
  - Justificativa de resolução (mínimo 5 caracteres).
- [ ] Linha do tempo de histórico (`GET /api/tasks/:id/history`).

---

### ⏳ Etapa 6: Gestão de Ativos Industriais & Métricas
- [ ] Inventário de Equipamentos (`GET /api/equipment` e `POST /api/equipment`).
- [ ] Visualização de falhas observadas e histórico de OS por equipamento.
- [ ] Dashboard de Métricas Operacionais (`GET /api/tasks/metrics`):
  - Cards de total de tarefas e taxa de bloqueio.
  - Indicador de Lead Time médio (horas).
  - Ranking de equipamentos mais acionados.
