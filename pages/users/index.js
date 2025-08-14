import useSWR from 'swr';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function UsersPage(props) {
  const { data: session } = useSession();
  if (session && session.user?.role !== 'Admin') {
    return (
      <Layout {...props}>
        <div className="card">Forbidden: Admins only.</div>
      </Layout>
    );
  }
  const { data, mutate } = useSWR('/api/users', fetcher);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', role: 'Sales Manager', assignedLocations: [] });
  const [locationInput, setLocationInput] = useState('');

  const openNew = () => { setEditing(null); setForm({ username: '', password: '', role: 'Sales Manager', assignedLocations: [] }); setIsOpen(true); };
  const openEdit = (u) => { setEditing(u); setForm({ username: u.username, password: '', role: u.role, assignedLocations: u.assignedLocations || [] }); setIsOpen(true); };

  const save = async () => {
    try {
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch('/api/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { id: editing._id, ...form } : form),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Saved');
      setIsOpen(false);
      await mutate();
    } catch (e) { toast.error(e.message || 'Error'); }
  };

  const remove = async (u) => {
    if (!confirm('Delete user?')) return;
    const res = await fetch('/api/users?id=' + u._id, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); mutate(); } else { toast.error('Error deleting'); }
  };

  const addLocation = () => {
    if (!locationInput.trim()) return;
    setForm((f) => ({ ...f, assignedLocations: Array.from(new Set([...(f.assignedLocations || []), locationInput.trim()])) }));
    setLocationInput('');
  };

  const removeLocation = (loc) => {
    setForm((f) => ({ ...f, assignedLocations: (f.assignedLocations || []).filter((l) => l !== loc) }));
  };

  return (
    <Layout {...props}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Manage Users</h1>
        <button className="btn-primary" onClick={openNew}>Add User</button>
      </div>

      <div className="overflow-x-auto card">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Username</th>
              <th className="th">Role</th>
              <th className="th">Location(s)</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {(data?.users || []).map((u) => (
              <tr key={u._id}>
                <td className="td">{u.username}</td>
                <td className="td">{u.role}</td>
                <td className="td">{(u.assignedLocations || []).join(', ')}</td>
                <td className="td space-x-2">
                  <button className="btn-secondary" onClick={() => openEdit(u)}>Edit</button>
                  <button className="btn-secondary" onClick={() => remove(u)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal title={editing ? 'Edit User' : 'Add User'} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password {editing && <span className="text-xs text-gray-500">(leave blank to keep)</span>}</label>
            <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option>Admin</option>
              <option>Sales Manager</option>
              <option>Stock Manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Locations</label>
            <div className="flex gap-2">
              <input className="input" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} placeholder="Add location" />
              <button className="btn-secondary" onClick={addLocation} type="button">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(form.assignedLocations || []).map((loc) => (
                <span key={loc} className="inline-flex items-center gap-1 rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">
                  {loc}
                  <button onClick={() => removeLocation(loc)} className="text-red-600">×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={save}>{editing ? 'Save' : 'Create'}</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}


