import { Router } from 'express';
import prisma from '../prismaClient.js';
import { requireRole } from '../middleware/auth.js';
const router = Router();

// Create equipment (admin)
router.post('/', requireRole(['ADMIN']), async (req, res) => {
  const { name, category, condition, totalQty } = req.body;
  if (!name || totalQty == null) return res.status(400).json({ error: 'name and totalQty required' });
  const eq = await prisma.equipment.create({ data: { name, category, condition, totalQty }});
  res.json(eq);
});

// Edit (admin)
router.put('/:id', requireRole(['ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  const eq = await prisma.equipment.update({ where: { id }, data });
  res.json(eq);
});

// Delete (admin)
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  await prisma.equipment.delete({ where: { id }});
  res.json({ ok: true });
});

// List with simple search & filter
router.get('/', async (req, res) => {
  const { q, category } = req.query as any;
  const where: any = {};
  if (q) where.name = { contains: q, mode: 'insensitive' };
  if (category) where.category = category;
  const items = await prisma.equipment.findMany({ where, orderBy: { name: 'asc' }});
  res.json(items);
});

// Get single equipment
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const item = await prisma.equipment.findUnique({ where: { id }});
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
});

export default router;
