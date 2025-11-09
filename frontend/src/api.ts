import { User, Equipment, LoanRequest } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string,string> = {
    ...(opts.headers as Record<string,string> || {}),
    'Content-Type': (opts.headers as any)?.['Content-Type'] || 'application/json'
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'unknown' }));
    throw body;
  }
  return res.json() as Promise<T>;
}

/* Auth */
export async function login(email: string): Promise<{ token: string; user: User }> {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
}
export async function signup(name: string, email: string, role?: string) {
  return request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, role }) });
}

/* Equipment */
export async function listEquipment(q?: string, category?: string): Promise<Equipment[]> {
  const query = new URLSearchParams();
  if (q) query.set('q', q);
  if (category) query.set('category', category);
  return request<Equipment[]>(`/equipment?${query.toString()}`);
}
export async function getEquipment(id: number): Promise<Equipment> {
  return request<Equipment>(`/equipment/${id}`);
}
export async function createEquipment(payload: Partial<Equipment>): Promise<Equipment> {
  return request<Equipment>('/equipment', { method: 'POST', body: JSON.stringify(payload) });
}
export async function updateEquipment(id: number, payload: Partial<Equipment>): Promise<Equipment> {
  return request<Equipment>(`/equipment/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}
export async function deleteEquipment(id: number) {
  return request('/equipment/' + id, { method: 'DELETE' });
}

/* Requests */
export async function createRequest(payload: {
  equipmentId: number;
  quantity: number;
  startDate: string;
  endDate: string;
}): Promise<any> {
  return request('/requests', { method: 'POST', body: JSON.stringify(payload) });
}
export async function listRequests(): Promise<LoanRequest[]> {
  return request('/requests');
}
export async function approveRequest(id: number) {
  return request(`/requests/${id}/approve`, { method: 'PUT' });
}
export async function rejectRequest(id: number) {
  return request(`/requests/${id}/reject`, { method: 'PUT' });
}
export async function markReturned(id: number) {
  return request(`/requests/${id}/mark-returned`, { method: 'PUT' });
}
