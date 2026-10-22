# 🖥️ Task & Asset Management - Frontend (Task-Manager-FE)

Interface web para gestão de ordens de serviço, inventário de ativos industriais, matriz de priorização GUT e controle do ciclo de vida de tarefas operacionais em múltiplas unidades.

Integrado ao backend [`Task-Manager-BE`](http://localhost:3333).

---

## 📑 Sumário

- [Configuração de Ambiente](#-configuração-de-ambiente)
- [Autenticação & Sessão](#-autenticação--sessão)
- [Perfis & Controle de Acesso (RBAC)](#-perfis--controle-de-acesso-rbac)
- [Regras de Negócio & Lógica de Interface](#-regras-de-negócio--lógica-de-interface)
  - [Matriz de Prioridade GUT](#1-matriz-de-prioridade-gut)
  - [Máquina de Estados de Tarefas](#2-máquina-de-estados-de-tarefas)
- [Contratos de API & Endpoints](#-contratos-de-api--endpoints)
- [Tipagens TypeScript (Contracts)](#-tipagens-typescript-contracts)
- [Padrão de Erros da API](#-padrão-de-erros-da-api)
- [Sugestão de Telas & Fluxos](#-sugestão-de-telas--fluxos)

---

## ⚙️ Configuração de Ambiente

Crie um arquivo `.env` no frontend apontando para o backend local:

```env
# Exemplo para Vite
VITE_API_BASE_URL=http://localhost:3333

# Exemplo para Next.js
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

### Credenciais de Teste (Seed do Backend)

| Usuário            | E-mail                     |  Senha   | Perfil (Role) | Permissão de Criar Tarefas |
| :----------------- | :------------------------- | :------: | :-----------: | :------------------------: |
| **Carlos Gerente** | `manager@taskmanager.com`  | `123456` |   `MANAGER`   |           ✅ Sim           |
| **João Operador**  | `operator@taskmanager.com` | `123456` |  `OPERATOR`   |  ❌ Não (Apenas execução)  |

---

## 🔐 Autenticação & Sessão

- **Mecanismo:** Bearer Token JWT.
- **Header obrigatório:** `Authorization: Bearer <token>` em todas as requisições privadas.
- **Validade do Token:** 7 dias.
- **Payload do Token:** `{ id: string, role: Role, unitId: string }`.

> **Recomendação para o Client HTTP (Axios / Fetch Wrapper):**
> Configure um interceptor de requisição para injetar o token e um interceptor de resposta para capturar HTTP `401` e redirecionar para a tela de login limpando o storage.

---

## 🛡️ Perfis & Controle de Acesso (RBAC)

Hierarquia de perfis definida no enum `Role`:

| Perfil       | Descrição                     | Criar Tarefas | Atribuir Responsável | Cadastrar Equipamento |
| :----------- | :---------------------------- | :-----------: | :------------------: | :-------------------: |
| `MANAGER`    | Gerente geral de operações    |      ✅       |          ✅          |          ✅           |
| `ANALYST`    | Analista de planejamento/PCP  |      ✅       |          ✅          |          ✅           |
| `SUPERVISOR` | Supervisor de equipe de campo |      ❌       |          ✅          |          ✅           |
| `FOREMAN`    | Encarregado técnico de turno  |      ❌       |          ✅          |          ✅           |
| `TECHNICIAN` | Técnico especializado         |      ❌       |          ❌          |          ❌           |
| `OPERATOR`   | Operador executor             |      ❌       |          ❌          |          ❌           |

---

## 🧠 Regras de Negócio & Lógica de Interface

### 1. Matriz de Prioridade GUT

O cálculo da prioridade é feito na criação da tarefa:

$$\text{Score} = \text{Gravidade} \times \text{Urgência} \times \text{Tendência} \quad (1 \le \text{Score} \le 125)$$

Os campos $G$, $U$ e $T$ aceitam inteiros de **1 a 5**. A UI deve calcular dinamicamente o preview do Score e da Criticidade:

- 🔴 **HIGH (Crítico):** $\text{Score} \ge 80$
- 🟡 **MEDIUM (Médio):** $30 \le \text{Score} < 80$
- 🟢 **LOW (Baixo):** $\text{Score} < 30$

### 2. Máquina de Estados de Tarefas

```
[RECEIVED] ──(Atribuição: ownerId)──> [ASSIGNED] ──(Iniciar)──> [IN_PROGRESS]
                                                                  │       ▲
                                           (Bloquear + Justif.   │       │ (Desbloquear +
                                            + Anexo URL)          ▼       │  Justif. Resolução)
                                                               [BLOCKED] ─┘
                                                                  │
                                                          (Finalizar)
                                                                  ▼
                                                                [DONE] ──(Gestor valida)──> [ACCEPTED]
```

#### Regras de Validação para Transição (`PATCH /api/tasks/:id/status`):

- `IN_PROGRESS` $\to$ `BLOCKED`: **Obrigatório** enviar `reason` (mínimo 10 caracteres) e `attachmentUrl` válida (URL da evidência do bloqueio). Se ausente, o backend responde `422 Unprocessable Entity`.
- `BLOCKED` $\to$ `IN_PROGRESS`: **Obrigatório** enviar `reason` (mínimo 5 caracteres) descrevendo a ação de desbloqueio.
- `IN_PROGRESS` $\to$ `DONE`: Marca a tarefa como entregue pelo operador (`deliveryDate = now()`).
- Usuário com papel de gestão enviando status `DONE`: Registra aceite final (`acceptedDate = now()`).

---

## 📡 Contratos de API & Endpoints

### 🩺 Health Check

- `GET /health` -> `{ status: "ok", uptime: number, timestamp: string }`

### 🔑 Autenticação & Usuários

- `POST /api/auth/login`
  - **Body:** `{ "email": string, "password": string }`
  - **Retorno:** `{ "token": string, "user": User }`
- `GET /api/users` _(Auth)_
  - **Query:** `?role=OPERATOR&unitId=uuid`
  - **Retorno:** `User[]` (sem campos sensíveis como hash de senha)

### 🏢 Unidades & Equipamentos

- `GET /api/units` _(Auth)_
  - **Retorno:** `Unit[]`
- `GET /api/equipment` _(Auth)_
  - **Query:** `?unitId=uuid&category=ELECTRICAL`
  - **Retorno:** `Equipment[]`
- `GET /api/equipment/:id` _(Auth)_
  - **Retorno:** `Equipment & { unit: Unit }`
- `GET /api/equipment/:id/tasks` _(Auth)_
  - **Retorno:** Lista de tarefas e histórico de manutenção do equipamento.
- `POST /api/equipment` _(Auth: MANAGER, ANALYST, SUPERVISOR, FOREMAN)_
  - **Body:**
    ```json
    {
      "tagId": "GER-02",
      "category": "ELECTRICAL",
      "unitId": "uuid-da-unidade",
      "specificLocation": "Subsolo - Sala B",
      "observedFault": "Ruído no rolamento",
      "preventiveData": { "intervalDays": 90, "lastReview": "2026-09-15" }
    }
    ```
- `PATCH /api/equipment/:id` _(Auth: Gestão)_
  - **Body:** Campos parciais de atualização.

### 📋 Tarefas & Métricas

- `GET /api/tasks` _(Auth)_
  - **Query:** `?unitId=uuid&status=RECEIVED&ownerId=uuid`
  - **Ordenação padrão:** Ordenadas por `priorityScore DESC, createdAt ASC` (mais críticas primeiro).
- `GET /api/tasks/my-tasks` _(Auth)_
  - Retorna apenas as tarefas atribuídas ao usuário logado (`ownerId === token.id`).
- `GET /api/tasks/metrics` _(Auth)_
  - **Query:** `?unitId=uuid&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
  - **Retorno:**
    ```json
    {
      "totalTasks": 42,
      "byStatus": {
        "RECEIVED": 5,
        "ASSIGNED": 8,
        "IN_PROGRESS": 12,
        "BLOCKED": 3,
        "DONE": 14
      },
      "byCriticality": { "HIGH": 10, "MEDIUM": 22, "LOW": 10 },
      "blockingMetrics": {
        "currentlyBlocked": 3,
        "everBlockedCount": 5,
        "blockingRatePercentage": 11.9
      },
      "completionMetrics": {
        "totalDone": 14,
        "totalAccepted": 11,
        "averageLeadTimeHours": 4.5
      },
      "topEquipments": [
        { "tagId": "GER-01", "category": "ELECTRICAL", "count": 6 }
      ]
    }
    ```
- `GET /api/tasks/:id` _(Auth)_
  - **Retorno:** Detalhes completos da tarefa com relacionamentos (`unit`, `equipment`, `owner`, `createdBy`, `notes`).
- `POST /api/tasks` _(Auth: ANALYST ou MANAGER)_
  - **Body:**
    ```json
    {
      "description": "Substituição emergencial de contator",
      "unitId": "uuid",
      "equipmentId": "uuid-opcional",
      "matrixType": "GUT",
      "gravity": 5,
      "urgency": 4,
      "trend": 4,
      "riskFactor": "Risco de parada na linha de produção"
    }
    ```
- `PATCH /api/tasks/:id/assign` _(Auth: Gestão)_
  - **Body:** `{ "ownerId": "uuid-do-usuario" }`
- `PATCH /api/tasks/:id/status` _(Auth)_
  - **Body:**
    ```json
    {
      "newStatus": "BLOCKED",
      "reason": "Falta de peça no almoxarifado",
      "attachmentUrl": "https://meubucket.com/comprovante.jpg"
    }
    ```
- `POST /api/tasks/:id/notes` _(Auth)_
  - **Body:**
    ```json
    {
      "text": "Executado teste de continuidade do circuito.",
      "imageUrls": ["https://meubucket.com/foto1.jpg"]
    }
    ```
- `GET /api/tasks/:id/history` _(Auth)_
  - **Retorno:** Linha do tempo de alterações com dados do usuário que realizou a transição (`TaskLog[]`).

---

## 📦 Tipagens TypeScript (Contracts)

Copie estas definições para sua camada de tipos (ex: `src/types/api.ts`):

```typescript
export type Role =
  | "ANALYST"
  | "MANAGER"
  | "SUPERVISOR"
  | "FOREMAN"
  | "TECHNICIAN"
  | "OPERATOR";

export type Specialty =
  | "ELECTRICAL"
  | "MECHANICAL"
  | "HVAC"
  | "INFRASTRUCTURE"
  | "PROJECT";

export type EquipmentCategory =
  | "ELECTRICAL"
  | "MECHANICAL"
  | "INFRASTRUCTURE"
  | "PROJECT"
  | "CABLING"
  | "CIVIL"
  | "ENGINEERING";

export type TaskStatus =
  | "RECEIVED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "DONE";

export type Criticality = "LOW" | "MEDIUM" | "HIGH";
export type MatrixType = "GUT" | "ICE" | "NPR";

export interface Unit {
  id: string;
  name: string;
  address: string;
  criticalityFactor?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  specialty?: Specialty | null;
  unitId: string;
  isActive?: boolean;
}

export interface Equipment {
  id: string;
  tagId: string;
  category: EquipmentCategory;
  unitId: string;
  specificLocation: string;
  observedFault?: string | null;
  preventiveData?: Record<string, unknown> | null;
  createdAt: string;
  unit?: Unit;
}

export interface TaskNote {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  imageUrls: string[];
  createdAt: string;
  user?: Pick<User, "id" | "name" | "role">;
}

export interface TaskLog {
  id: string;
  taskId: string;
  userId: string;
  previousStatus: TaskStatus | null;
  newStatus: TaskStatus;
  reason?: string | null;
  attachmentUrl?: string | null;
  createdAt: string;
  user?: Pick<User, "id" | "name" | "role">;
}

export interface Task {
  id: string;
  seqCode: number;
  description: string;
  unitId: string;
  equipmentId?: string | null;
  ownerId?: string | null;
  status: TaskStatus;
  riskFactor?: string | null;
  matrixType: MatrixType;
  priorityScore: number;
  criticality: Criticality;
  deliveryDate?: string | null;
  acceptedDate?: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  unit?: Unit;
  equipment?: Equipment | null;
  owner?: User | null;
  createdBy?: User;
  notes?: TaskNote[];
  transitions?: TaskLog[];
}

export interface TasksMetricsResponse {
  totalTasks: number;
  byStatus: Record<TaskStatus, number>;
  byCriticality: Record<Criticality, number>;
  blockingMetrics: {
    currentlyBlocked: number;
    everBlockedCount: number;
    blockingRatePercentage: number;
  };
  completionMetrics: {
    totalDone: number;
    totalAccepted: number;
    averageLeadTimeHours: number;
  };
  topEquipments: Array<{
    tagId: string;
    category: EquipmentCategory;
    count: number;
  }>;
}
```

---

## ⚠️ Padrão de Erros da API

O backend responde erros padronizados no seguinte formato:

### Erros de Regra de Negócio (ex: 400, 401, 403, 404, 422)

```json
{
  "status": "error",
  "message": "Reason must have at least 10 characters to block a task"
}
```

### Erros de Validação Zod (HTTP 422)

```json
{
  "status": "error",
  "message": "Validation error",
  "issues": [
    {
      "code": "too_small",
      "minimum": 3,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Description must have at least 3 characters",
      "path": ["description"]
    }
  ]
}
```

---

## 🎨 Sugestão de Telas & Fluxos

1. **Login:** E-mail e senha com redirecionamento baseado no perfil (`OPERATOR` $\to$ `/my-tasks`, outros $\to$ `/dashboard`).
2. **Dashboard de Métricas:** Cards de resumo, Lead Time médio, taxa de bloqueio e gráfico de equipamentos mais acionados (`GET /api/tasks/metrics`).
3. **Painel de Tarefas (Kanban ou Tabela Ordenada):**
   - Ordenado por Criticidade (`priorityScore DESC`).
   - Badges de criticidade: 🔴 HIGH (Score $\ge$ 80), 🟡 MEDIUM (30–79), 🟢 LOW (< 30).
   - Filtros por Unidade, Status e Atribuído.
4. **Minhas Tarefas (`/my-tasks`):** Visão focada para o técnico/operador assumir, pausar, relatar bloqueio ou concluir tarefas.
5. **Modal / Formulário de Nova Tarefa:**
   - Sliders ou inputs numéricos (1 a 5) para $G$, $U$, $T$ com exibição em tempo real do Score calculado e badge de Criticidade.
6. **Gaveta / Página de Detalhe da Tarefa:**
   - Botões de ação contextual conforme o status atual.
   - Histórico em linha do tempo (`GET /api/tasks/:id/history`).
   - Aba de Notas/Comentários e Evidências com fotos (`POST /api/tasks/:id/notes`).
7. **Inventário de Equipamentos (`/equipment`):** Listagem de ativos industriais, status de falha observada e histórico de OS atreladas.

```

```
