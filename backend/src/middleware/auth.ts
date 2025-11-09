import type { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient';

// Load user from Authorization: Bearer <token>
export async function loadUser(req: Request, res: Response, next: NextFunction) {
  const auth = req.header('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) { next(); return; }
  const user = await prisma.user.findFirst({ where: { token } });
  if (user) (req as any).user = user;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!(req as any).user) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

export function requireRole(roles: Array<'STUDENT'|'STAFF'|'ADMIN'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
