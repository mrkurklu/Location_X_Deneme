import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home(props) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <Layout {...props}>
      <h1 className="text-2xl font-semibold mb-6">Location X Management System</h1>
      {loading ? (
        <div>Loading...</div>
      ) : session ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="card">Total Stock: --</div>
          <div className="card">Estimated Stock: --</div>
          <div className="card">Total Sales: --</div>
          <div className="card">Total Locations: --</div>

          <div className="lg:col-span-2 card">Stock Change Over Time (placeholder)</div>
          <div className="lg:col-span-2 card">Sales Trends (placeholder)</div>

          <nav className="lg:col-span-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <Link href="/stock" className="card hover:shadow">Manage Stock</Link>
            <Link href="/sales" className="card hover:shadow">View Sales</Link>
            <Link href="/sales/management" className="card hover:shadow">Sales Management</Link>
            <Link href="/users" className="card hover:shadow">Manage Users</Link>
          </nav>
        </div>
      ) : (
        <div className="card">Please login to access the system.</div>
      )}
    </Layout>
  );
}


