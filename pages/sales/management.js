import Layout from '../../components/Layout';

export default function SalesManagementPage(props) {
  return (
    <Layout {...props}>
      <h1 className="text-xl font-semibold mb-4">Sales Management</h1>
      <div className="grid grid-cols-1 gap-4">
        <div className="card">Compare Current vs Estimated Stock by location (placeholder)</div>
        <div className="card">Sales list with export to CSV (placeholder)</div>
      </div>
    </Layout>
  );
}


