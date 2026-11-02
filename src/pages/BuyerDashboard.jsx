
import { useEffect, useState } from "react";

export default function BuyerDashboard({ user, onLogout }) {
  const [products, setProducts] = useState(() =>
    JSON.parse(localStorage.getItem("agri_products") || "[]")
  );

  const [search, setSearch] = useState("");

  const [orders, setOrders] = useState(() =>
    JSON.parse(localStorage.getItem("agri_orders") || "[]")
      .filter(order => order.buyerEmail === user.email)
  );

  // Refresh data when another dashboard changes Local Storage
  useEffect(() => {
    function refreshData() {
      setProducts(
        JSON.parse(localStorage.getItem("agri_products") || "[]")
      );

      setOrders(
        JSON.parse(localStorage.getItem("agri_orders") || "[]")
          .filter(order => order.buyerEmail === user.email)
      );
    }

    window.addEventListener("agri-data-updated", refreshData);
    window.addEventListener("storage", refreshData);

    return () => {
      window.removeEventListener("agri-data-updated", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, [user.email]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  function placeOrder(product) {
    const enteredQuantity = prompt(
      `Enter quantity in kg. Available: ${product.quantity}`
    );

    if (enteredQuantity === null) return;

    const quantity = Number(enteredQuantity);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isInteger(quantity)
    ) {
      alert("Enter a valid whole-number quantity.");
      return;
    }

    // Read the latest stock before placing the order
    const allProducts = JSON.parse(
      localStorage.getItem("agri_products") || "[]"
    );

    const currentProduct = allProducts.find(
      item => item.id === product.id
    );

    if (!currentProduct || quantity > currentProduct.quantity) {
      alert("Sorry, the requested stock is no longer available.");
      setProducts(allProducts);
      return;
    }

    // Reduce farmer's available stock
    const updatedProducts = allProducts.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity - quantity }
        : item
    );

    const newOrder = {
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      quantity,
      price: currentProduct.price,
      total: quantity * currentProduct.price,
      farmerEmail: currentProduct.farmerEmail,
      farmerName: currentProduct.farmerName,
      buyerEmail: user.email,
      buyerName: user.name,
      status: "Pending"
    };

    const allOrders = JSON.parse(
      localStorage.getItem("agri_orders") || "[]"
    );

    localStorage.setItem(
      "agri_products",
      JSON.stringify(updatedProducts)
    );

    localStorage.setItem(
      "agri_orders",
      JSON.stringify([...allOrders, newOrder])
    );

    setProducts(updatedProducts);
    setOrders(previous => [...previous, newOrder]);

    window.dispatchEvent(new Event("agri-data-updated"));

    alert("Order placed successfully!");
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>🌾 AgriMarket Buyer</h2>
        <button onClick={onLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <h1>Welcome, {user.name}!</h1>
        <p>Discover fresh agricultural products directly from farmers.</p>

        <section className="dashboard-panel">
          <h2>Find Agricultural Products</h2>

          <input
            className="buyer-search"
            placeholder="Search vegetables, fruits, grains..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </section>

        <section className="dashboard-panel">
          <h2>Available Products</h2>

          <div className="products-grid">
            {filteredProducts.filter(p => p.quantity > 0).length === 0 ? (
              <p>No products available.</p>
            ) : (
              filteredProducts
                .filter(product => product.quantity > 0)
                .map(product => (
                  <div className="product-card" key={product.id}>
                    <span className="category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>Price: ₹{product.price}/kg</p>
                    <p>Available: {product.quantity} kg</p>
                    <p>Farmer: {product.farmerName}</p>

                    <button onClick={() => placeOrder(product)}>
                      Place Order
                    </button>
                  </div>
                ))
            )}
          </div>
        </section>

        <section className="dashboard-panel">
          <h2>My Orders</h2>

          {orders.length === 0 ? (
            <p>You have not placed any orders yet.</p>
          ) : (
            orders.map(order => (
              <div className="product-card" key={order.id}>
                <h3>{order.productName}</h3>
                <p>Farmer: {order.farmerName}</p>
                <p>Quantity: {order.quantity} kg</p>
                <p>Total: ₹{order.total}</p>
                <p>Status: {order.status}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
