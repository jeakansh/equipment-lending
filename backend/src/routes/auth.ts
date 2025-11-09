import { Router } from 'express';
import prisma from '../prismaClient';
import crypto from 'crypto';

const router = Router();

// Signup (simple)
router.post('/signup', async (req, res) => {
  const { name, email, role } = req.body;
  if (!email || !name) return res.status(400).json({ error: 'name and email required' });
  try {
    const token = crypto.randomBytes(16).toString('hex');
    const user = await prisma.user.create({
      data: { name, email, role: role || 'STUDENT', token }
    });
    res.json({ token, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const token = crypto.randomBytes(16).toString('hex');
    user = await prisma.user.create({ data: { email, name: email.split('@')[0], role: 'STUDENT', token }});
    return res.json({ token: user.token, user });
  }
  // if user exists but has no token, set one
  if (!user.token) {
    const token = crypto.randomBytes(16).toString('hex');
    user = await prisma.user.update({ where: { id: user.id }, data: { token }});
  }
  res.json({ token: user.token, user });
});

export default router;
