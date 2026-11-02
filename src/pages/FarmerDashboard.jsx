
import { useEffect, useState } from "react";

export default function FarmerDashboard({ user, onLogout }) {
  const [products, setProducts] = useState(() =>
    JSON.parse(localStorage.getItem("agri_products") || "[]")
      .filter(p => p.farmerEmail === user.email)
  );

  const [orders, setOrders] = useState(() =>
    JSON.parse(localStorage.getItem("agri_orders") || "[]")
      .filter(order => order.farmerEmail === user.email)
  );

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "Vegetables"
  });

  // Refresh farmer products and orders
  useEffect(() => {
    function refreshData() {
      setProducts(
        JSON.parse(localStorage.getItem("agri_products") || "[]")
          .filter(p => p.farmerEmail === user.email)
      );

      setOrders(
        JSON.parse(localStorage.getItem("agri_orders") || "[]")
          .filter(order => order.farmerEmail === user.email)
      );
    }

    window.addEventListener("agri-data-updated", refreshData);
    window.addEventListener("storage", refreshData);

    return () => {
      window.removeEventListener("agri-data-updated", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, [user.email]);

  function addProduct(e) {
    e.preventDefault();

    const product = {
      id: crypto.randomUUID(),
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      farmerEmail: user.email,
      farmerName: user.name
    };

    const allProducts = JSON.parse(
      localStorage.getItem("agri_products") || "[]"
    );

    const updated = [...allProducts, product];

    localStorage.setItem("agri_products", JSON.stringify(updated));
    setProducts(updated.filter(p => p.farmerEmail === user.email));

    window.dispatchEvent(new Event("agri-data-updated"));

    setForm({
      name: "",
      price: "",
      quantity: "",
      category: "Vegetables"
    });

    alert("Product added successfully!");
  }

  function deleteProduct(id) {
    const allProducts = JSON.parse(
      localStorage.getItem("agri_products") || "[]"
    );

    const updated = allProducts.filter(p => p.id !== id);

    localStorage.setItem("agri_products", JSON.stringify(updated));

    setProducts(updated.filter(p => p.farmerEmail === user.email));

    window.dispatchEvent(new Event("agri-data-updated"));
  }

  const totalQuantity = products.reduce(
    (sum, p) => sum + p.quantity, 0
  );

  const stockValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity, 0
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>🌾 AgriMarket Farmer</h2>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <h1>Welcome, {user.name}!</h1>
        <p>Manage your agricultural products and sales.</p>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>

          <div className="stat-card">
            <h3>{totalQuantity}</h3>
            <p>Total Quantity (kg)</p>
          </div>

          <div className="stat-card">
            <h3>₹{stockValue}</h3>
            <p>Listed Stock Value</p>
          </div>
        </div>

        <section className="dashboard-panel">
          <h2>Add New Product</h2>

          <form onSubmit={addProduct} className="product-form">
            <input
              placeholder="Product name"
              required
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <select
              value={form.category}
              onChange={e =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains</option>
              <option>Pulses</option>
            </select>

            <input
              type="number"
              placeholder="Price per kg (₹)"
              min="1"
              required
              value={form.price}
              onChange={e =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Quantity (kg)"
              min="1"
              required
              value={form.quantity}
              onChange={e =>
                setForm({ ...form, quantity: e.target.value })
              }
            />

            <button type="submit">Add Product</button>
          </form>
        </section>

        <section className="dashboard-panel">
          <h2>My Products</h2>

          {products.length === 0 ? (
            <p>No products added yet. Add your first product above.</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div className="product-card" key={product.id}>
                  <span className="category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>Price: ₹{product.price}/kg</p>
                  <p>Available Stock: {product.quantity} kg</p>

                  <button
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete Product
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-panel">
          <h2>Customer Orders</h2>

          {orders.length === 0 ? (
            <p>No customer orders received yet.</p>
          ) : (
            <div className="products-grid">
              {orders.map(order => (
                <div className="product-card" key={order.id}>
                  <h3>{order.productName}</h3>
                  <p>Buyer: {order.buyerName || order.buyerEmail}</p>
                  <p>Quantity: {order.quantity} kg</p>
                  <p>Total Amount: ₹{order.total}</p>
                  <p>Status: {order.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
