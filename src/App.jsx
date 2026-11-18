import { Routes, Route, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getToken, logout } from './api.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Orders from './pages/Orders.jsx';

function Layout() {
  const nav = useNavigate();
  if (!getToken()) return <Navigate to="/login" replace />;
  const out = () => { logout(); nav('/login'); };
  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">BERRY</div>
        <p className="group">Dashboard</p>
        <NavLink to="/" end>Default</NavLink>
        <p className="group">Store</p>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <button className="logout" onClick={out}>Logout</button>
      </aside>
      <section className="content"><Outlet /></section>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
