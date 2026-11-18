import { useEffect, useState } from 'react';
import { getOrders, setOrderStatus } from '../api.js';

const STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const load = () => getOrders().then(setList).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  async function change(id, status) {
    await setOrderStatus(id, status);
    load();
  }

  return (
    <>
      <h1>Orders</h1>
      {error && <p className="error">{error}</p>}
      <div className="panel">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6).toUpperCase()}<div className="muted">{new Date(o.createdAt).toLocaleDateString()}</div></td>
                <td>{o.customer.name}<div className="muted">{o.customer.phone} {o.customer.city}</div></td>
                <td>{o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}</td>
                <td>${o.total}</td>
                <td>
                  <select value={o.status} onChange={(e) => change(o._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan="5" className="muted">Abhi koi order nahi aaya.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
