import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js'
import equipmentRoutes from './routes/equipment.js';
import requestsRoutes from './routes/requests.js';
import { loadUser } from './middleware/auth.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(loadUser);

app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/requests', requestsRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

export default app;
