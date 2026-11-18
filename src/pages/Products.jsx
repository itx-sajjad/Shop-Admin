import { useEffect, useState } from 'react';
import { getProducts, saveProduct, deleteProduct } from '../api.js';

const fallbackImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85';
const EMPTY = { name: '', price: '', oldPrice: '', rating: 4.5, image: fallbackImage, category: 'T-shirts', isNewArrival: false, isTopSelling: false };
const CATS = ['T-shirts', 'Shirts', 'Jeans', 'Shorts'];

export default function Products() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  const load = () => getProducts().then(setList).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await saveProduct({
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : 0,
        rating: Number(form.rating),
      });
      setForm(null);
      load();
    } catch (err) { setError(err.message); }
  }

  async function remove(p) {
    if (!window.confirm(`"${p.name}" delete karein?`)) return;
    await deleteProduct(p._id);
    load();
  }

  return (
    <>
      <div className="row">
        <h1>Products</h1>
        <button className="btn" onClick={() => setForm({ ...EMPTY })}>Add product</button>
      </div>
      {error && <p className="error">{error}</p>}

      {form && (
        <form className="panel form" onSubmit={submit}>
          <h2>{form._id ? 'Product edit karein' : 'Naya product'}</h2>
          <div className="cols">
            <label>Naam<input required value={form.name} onChange={set('name')} /></label>
            <label>Category
              <select value={form.category} onChange={set('category')}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            <label>Price ($)<input type="number" min="0" required value={form.price} onChange={set('price')} /></label>
            <label>Purani price ($)<input type="number" min="0" value={form.oldPrice || ''} onChange={set('oldPrice')} /></label>
            <label>Rating (0-5)<input type="number" min="0" max="5" step="0.5" value={form.rating} onChange={set('rating')} /></label>
            <label>Image URL<input value={form.image} onChange={set('image')} /></label>
          </div>
          <div className="checks">
            <label><input type="checkbox" checked={!!form.isNewArrival} onChange={set('isNewArrival')} /> New Arrival</label>
            <label><input type="checkbox" checked={!!form.isTopSelling} onChange={set('isTopSelling')} /> Top Selling</label>
          </div>
          <div className="row">
            <button className="btn">Save product</button>
            <button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="panel">
        <table>
          <thead><tr><th></th><th>Naam</th><th>Category</th><th>Price</th><th>Tags</th><th></th></tr></thead>
          <tbody>
            {list.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    className="thumb"
                    src={p.image || fallbackImage}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>{p.isNewArrival && <span className="tag Shipped">New</span>} {p.isTopSelling && <span className="tag Delivered">Top</span>}</td>
                <td className="actions">
                  <button className="link" onClick={() => setForm({ ...p })}>Edit</button>
                  <button className="link danger" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan="6" className="muted">Koi product nahi. "Add product" se shuru karein.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
