import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import { requireApiAuth, Roles } from '../../utils/rbac';

export default async function handler(req, res) {
  const auth = await requireApiAuth(req, res, [Roles.Admin]);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.message });

  await connectToDatabase();

  if (req.method === 'GET') {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json({ users });
  }

  if (req.method === 'POST') {
    const { username, password, role, assignedLocations } = req.body || {};
    if (!username || !password || !role) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: 'Username exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, role, assignedLocations: assignedLocations || [] });
    return res.status(201).json({ user });
  }

  if (req.method === 'PUT') {
    const { id, username, password, role, assignedLocations } = req.body || {};
    if (!id || !username || !role) return res.status(400).json({ error: 'Missing fields' });
    const update = { username, role, assignedLocations: assignedLocations || [] };
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(id, update, { new: true });
    return res.json({ user });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    await User.findByIdAndDelete(id);
    return res.json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end('Method Not Allowed');
}


