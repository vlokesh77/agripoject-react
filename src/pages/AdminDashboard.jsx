
import { useEffect, useState } from "react";
import { getUsers } from "../storage";

export default function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState(() => getUsers());
  const [products, setProducts] = useState(() =>
    JSON.parse(localStorage.getItem("agri_products") || "[]")
  );
  const [orders, setOrders] = useState(() =>
    JSON.parse(localStorage.getItem("agri_orders") || "[]")
  );

  function refreshData() {
    setUsers(getUsers());
    setProducts(
      JSON.parse(localStorage.getItem("agri_products") || "[]")
    );
    setOrders(
      JSON.parse(localStorage.getItem("agri_orders") || "[]")
    );
  }

  useEffect(() => {
    window.addEventListener("agri-data-updated", refreshData);
    window.addEventListener("storage", refreshData);

    return () => {
      window.removeEventListener("agri-data-updated", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, []);

  function updateOrderStatus(orderId, status) {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );

    localStorage.setItem(
      "agri_orders",
      JSON.stringify(updatedOrders)
    );

    setOrders(updatedOrders);
    window.dispatchEvent(new Event("agri-data-updated"));
  }

  const farmers = users.filter(u => u.role === "farmer");
  const buyers = users.filter(u => u.role === "buyer");

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total || 0), 0
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>🌾 AgriMarket Admin</h2>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <h1>Welcome, {user.name}!</h1>
        <p>Monitor farmers, buyers, products and customer orders.</p>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>

          <div className="stat-card">
            <h3>{farmers.length}</h3>
            <p>Total Farmers</p>
          </div>

          <div className="stat-card">
            <h3>{buyers.length}</h3>
            <p>Total Buyers</p>
          </div>

          <div className="stat-card">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>

          <div className="stat-card">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>

          <div className="stat-card">
            <h3>₹{totalSales}</h3>
            <p>Total Order Value</p>
          </div>
        </div>

        <section className="dashboard-panel">
          <h2>Registered Users</h2>

          {users.length === 0 ? (
            <p>No users registered.</p>
          ) : (
            <div className="products-grid">
              {users.map(account => (
                <div className="product-card" key={account.id}>
                  <h3>{account.name}</h3>
                  <p>Email: {account.email}</p>
                  <p>Role: {account.role.toUpperCase()}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-panel">
          <h2>All Agricultural Products</h2>

          {products.length === 0 ? (
            <p>No products listed yet.</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div className="product-card" key={product.id}>
                  <span className="category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>Farmer: {product.farmerName}</p>
                  <p>Price: ₹{product.price}/kg</p>
                  <p>Available: {product.quantity} kg</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-panel">
          <h2>All Customer Orders</h2>

          {orders.length === 0 ? (
            <p>No customer orders received yet.</p>
          ) : (
            <div className="products-grid">
              {orders.map(order => (
                <div className="product-card" key={order.id}>
                  <h3>{order.productName}</h3>
                  <p>Buyer: {order.buyerName || order.buyerEmail}</p>
                  <p>Farmer: {order.farmerName || order.farmerEmail}</p>
                  <p>Quantity: {order.quantity} kg</p>
                  <p>Total: ₹{order.total}</p>

                  <label>Order Status</label>
                  <select
                    value={order.status}
                    onChange={e =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
