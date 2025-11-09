export type Role = 'STUDENT' | 'STAFF' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  token?: string;
}

export interface Equipment {
  id: number;
  name: string;
  category?: string | null;
  condition?: string | null;
  totalQty: number;
  createdAt?: string;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';

export interface LoanRequest {
  id: number;
  userId?: number;
  equipmentId: number;
  quantity: number;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  processedBy?: number | null;
  processedAt?: string | null;
  returnedAt?: string | null;
  equipment?: Equipment;
  user?: User;
}
