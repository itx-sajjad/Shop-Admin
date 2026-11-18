const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('admin_token');
export const logout = () => localStorage.removeItem('admin_token');

async function request(path, options = {}) {
  const res = await fetch(API + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: 'Bearer ' + getToken() } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== '/auth/login') {
    logout();
    window.location.href = '/login';
  }
  if (!res.ok) throw new Error(data.message || 'Kuch ghalat ho gaya');
  return data;
}

export const login = async (email, password) => {
  const d = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  localStorage.setItem('admin_token', d.token);
  return d;
};
export const getStats = () => request('/stats');
export const getProducts = () => request('/products');
export const saveProduct = (p) =>
  p._id
    ? request('/products/' + p._id, { method: 'PUT', body: JSON.stringify(p) })
    : request('/products', { method: 'POST', body: JSON.stringify(p) });
export const deleteProduct = (id) => request('/products/' + id, { method: 'DELETE' });
export const getOrders = () => request('/orders');
export const setOrderStatus = (id, status) =>
  request('/orders/' + id, { method: 'PATCH', body: JSON.stringify({ status }) });
