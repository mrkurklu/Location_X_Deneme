import { connectToDatabase } from '../../lib/mongodb';
import Stock from '../../models/Stock';
import { requireApiAuth, Roles } from '../../utils/rbac';

export default async function handler(req, res) {
  const auth = await requireApiAuth(req, res, [Roles.Admin, Roles.StockManager, Roles.SalesManager]);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.message });
  const user = auth.user;
  await connectToDatabase();

  if (req.method === 'GET') {
    const { location } = req.query;
    const filter = {};
    if (location) filter.location = location;
    if (user.role !== Roles.Admin && user.assignedLocations?.length) {
      filter.location = { $in: user.assignedLocations };
    }
    const items = await Stock.find(filter).sort({ date: -1 }).limit(200);
    return res.json({ items });
  }

  if (req.method === 'POST') {
    if (![Roles.Admin, Roles.StockManager].includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
    const item = await Stock.create(req.body);
    return res.status(201).json({ item });
  }

  if (req.method === 'PUT') {
    if (![Roles.Admin, Roles.StockManager].includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
    const { id, ...update } = req.body;
    const item = await Stock.findByIdAndUpdate(id, update, { new: true });
    return res.json({ item });
  }

  if (req.method === 'DELETE') {
    if (![Roles.Admin, Roles.StockManager].includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.query;
    await Stock.findByIdAndDelete(id);
    return res.json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end('Method Not Allowed');
}


