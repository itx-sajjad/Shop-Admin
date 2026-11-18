import { useEffect, useState } from 'react';
import { getStats } from '../api.js';

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { getStats().then(setS).catch((e) => setError(e.message)); }, []);
  if (error) return <p className="error">{error}</p>;
  if (!s) return <p>Load ho raha hai…</p>;
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat purple"><span>Total Revenue</span><b>${s.revenue}</b></div>
        <div className="stat blue"><span>Total Orders</span><b>{s.orders}</b></div>
        <div className="stat lilac"><span>Pending Orders</span><b>{s.pending}</b></div>
        <div className="stat sky"><span>Products</span><b>{s.products}</b></div>
      </div>
      <div className="panel">
        <h2>Recent Orders</h2>
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {s.recent.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.customer.name}</td>
                <td>${o.total}</td>
                <td><span className={'tag ' + o.status}>{o.status}</span></td>
              </tr>
            ))}
            {!s.recent.length && <tr><td colSpan="4" className="muted">Abhi koi order nahi aaya.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
