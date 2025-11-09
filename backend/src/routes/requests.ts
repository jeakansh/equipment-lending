import { Router } from 'express';
import prisma from '../prismaClient.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = Router();

// Create request (student/staff)
router.post('/', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { equipmentId, quantity, startDate, endDate } = req.body;
  if (!equipmentId || !quantity || !startDate || !endDate) return res.status(400).json({ error: 'missing fields' });

  // basic date validation
  const sd = new Date(startDate);
  const ed = new Date(endDate);
  if (sd > ed) return res.status(400).json({ error: 'startDate must be <= endDate' });

  const request = await prisma.loanRequest.create({
    data: {
      userId: user.id,
      equipmentId,
      quantity,
      startDate: sd,
      endDate: ed,
      status: 'PENDING'
    }
  });
  res.json(request);
});

// List (users see their own, admin/staff see all)
router.get('/', requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { status } = req.query as any;
  const where: any = {};
  if (user.role === 'STUDENT') where.userId = user.id;
  if (status) where.status = status;
  const requests = await prisma.loanRequest.findMany({ where, include: { equipment: true, user: true }, orderBy: { createdAt: 'desc' }});
  res.json(requests);
});

// Approve (admin/staff)
router.put('/:id/approve', requireRole(['ADMIN','STAFF']), async (req, res) => {
  const id = Number(req.params.id);
  // Start transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      const reqRow = await tx.loanRequest.findUnique({ where: { id }});
      if (!reqRow) throw { status: 404, message: 'request not found' };
      if (reqRow.status !== 'PENDING') throw { status: 400, message: 'only pending requests can be approved' };
      const availableAgg = await tx.loanRequest.aggregate({
        _sum: { quantity: true },
        where: {
          equipmentId: reqRow.equipmentId,
          status: 'APPROVED',
          AND: [
            { startDate: { lte: reqRow.endDate } },
            { endDate: { gte: reqRow.startDate } }
          ]
        }
      });
      const reserved = availableAgg._sum.quantity || 0;
      const equipment = await tx.equipment.findUnique({ where: { id: reqRow.equipmentId }});
      const total = equipment?.totalQty || 0;
      const available = total - reserved;
      if (available < reqRow.quantity) throw { status: 400, message: 'Not enough units available for that date range' };
      const updated = await tx.loanRequest.update({
        where: { id },
        data: { status: 'APPROVED', processedBy: (req as any).user.id, processedAt: new Date() }
      });
      return updated;
    });
    res.json(result);
  } catch (err: any) {
    const status = err?.status || 500;
    return res.status(status).json({ error: err?.message || 'error' });
  }
});

// Reject
router.put('/:id/reject', requireRole(['ADMIN','STAFF']), async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.loanRequest.findUnique({ where: { id }});
  if (!existing) return res.status(404).json({ error: 'not found' });
  if (existing.status !== 'PENDING') return res.status(400).json({ error: 'only pending requests can be rejected' });
  const updated = await prisma.loanRequest.update({ where: { id }, data: { status: 'REJECTED', processedBy: (req as any).user.id, processedAt: new Date() }});
  res.json(updated);
});

// Mark returned (admin/staff) — moves status to RETURNED and sets returnedAt
router.put('/:id/mark-returned', requireRole(['ADMIN','STAFF']), async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.loanRequest.findUnique({ where: { id }});
  if (!existing) return res.status(404).json({ error: 'not found' });
  if (existing.status !== 'APPROVED') return res.status(400).json({ error: 'only approved can be marked returned' });
  const updated = await prisma.loanRequest.update({ where: { id }, data: { status: 'RETURNED', returnedAt: new Date() }});
  res.json(updated);
});

export default router;
