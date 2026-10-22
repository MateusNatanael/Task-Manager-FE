/**
 * Tipagens TypeScript dos Contratos do Backend Task-Manager-BE
 */

export type Role =
  | 'ANALYST'
  | 'MANAGER'
  | 'SUPERVISOR'
  | 'FOREMAN'
  | 'TECHNICIAN'
  | 'OPERATOR';

export type Specialty =
  | 'ELECTRICAL'
  | 'MECHANICAL'
  | 'HVAC'
  | 'INFRASTRUCTURE'
  | 'PROJECT';

export type EquipmentCategory =
  | 'ELECTRICAL'
  | 'MECHANICAL'
  | 'INFRASTRUCTURE'
  | 'PROJECT'
  | 'CABLING'
  | 'CIVIL'
  | 'ENGINEERING';

export type TaskStatus =
  | 'RECEIVED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'DONE';

export type Criticality = 'LOW' | 'MEDIUM' | 'HIGH';
export type MatrixType = 'GUT' | 'ICE' | 'NPR';

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
  user?: Pick<User, 'id' | 'name' | 'role'>;
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
  user?: Pick<User, 'id' | 'name' | 'role'>;
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

export interface AuthLoginResponse {
  token: string;
  user: User;
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details?: Array<{
    field: string;
    issue: string;
  }>;
}
