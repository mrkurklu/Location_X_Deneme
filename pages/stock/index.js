import Layout from '../../components/Layout';

export default function StockPage(props) {
  return (
    <Layout {...props}>
      <h1 className="text-xl font-semibold mb-4">Manage Stock</h1>
      <div className="grid grid-cols-1 gap-4">
        <div className="card">Stock table placeholder (Username, Date, Box, Case, Registration Date) with search/filter/pagination</div>
        <div className="card">Estimated stock table placeholder</div>
      </div>
    </Layout>
  );
}


