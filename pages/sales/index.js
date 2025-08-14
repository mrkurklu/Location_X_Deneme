import Layout from '../../components/Layout';

export default function SalesPage(props) {
  return (
    <Layout {...props}>
      <h1 className="text-xl font-semibold mb-4">View Sales</h1>
      <div className="grid grid-cols-1 gap-4">
        <div className="card">Sales table placeholder (Date, Client Name, Product, Amount, Price, Time, Registration Date, Note) with filters</div>
      </div>
    </Layout>
  );
}


