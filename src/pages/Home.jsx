
import { useState } from "react";
import "../App.css";

const products = [
  { name: "Fresh Tomatoes", category: "Vegetables", price: 30, unit: "kg", icon: "🍅" },
  { name: "Organic Rice", category: "Grains", price: 55, unit: "kg", icon: "🌾" },
  { name: "Fresh Mangoes", category: "Fruits", price: 80, unit: "kg", icon: "🥭" },
  { name: "Green Chillies", category: "Vegetables", price: 45, unit: "kg", icon: "🌶️" },
  { name: "Fresh Potatoes", category: "Vegetables", price: 25, unit: "kg", icon: "🥔" },
  { name: "Groundnuts", category: "Pulses", price: 90, unit: "kg", icon: "🥜" }
];

function Home({ onLogin, onSignup }) {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">

      {/* Navigation */}
      <header className="navbar">
        <div className="logo">
          🌾 AgriMarket
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-buttons">
            <button
  className="login-btn"
  onClick={onLogin}
>
  Login
</button>
       
          <button className="signup-btn" onClick={onSignup}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <span className="hero-tag">🌱 FARMER TO BUYER MARKETPLACE</span>

          <h1>
            Connecting Farmers <br />
            <span>Directly With Buyers</span>
          </h1>

          <p>
            Buy fresh agricultural products directly from farmers.
            Promote fair pricing, support farmers and reduce middlemen.
          </p>

          <div className="hero-buttons">
            <button onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}>
              Explore Products →
            </button>
            <button className="outline-btn" onClick={() => alert("Farmer registration coming next!")}>
              Become a Farmer
            </button>
          </div>

          <div className="hero-stats">
            <div><strong>Direct</strong><span>Farmer Sales</span></div>
            <div><strong>Fair</strong><span>Market Pricing</span></div>
            <div><strong>Easy</strong><span>Online Orders</span></div>
          </div>
        </div>

        <div className="hero-image">
          <div className="farm-illustration">👨‍🌾</div>
          <div className="floating-card">
            <span>🌾</span>
            <div>
              <strong>Farm Fresh</strong>
              <p>Direct from farms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="section-heading">
          <span>WHY AGRIMARKET?</span>
          <h2>Better Agriculture Trading</h2>
          <p>One platform connecting farmers and customers.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span>🤝</span>
            <h3>Direct Connection</h3>
            <p>Connect farmers directly with buyers without unnecessary intermediaries.</p>
          </div>

          <div className="feature-card">
            <span>💰</span>
            <h3>Fair Pricing</h3>
            <p>Transparent product prices help farmers receive better value.</p>
          </div>

          <div className="feature-card">
            <span>📦</span>
            <h3>Easy Orders</h3>
            <p>Browse agricultural products and place orders conveniently.</p>
          </div>

          <div className="feature-card">
            <span>📈</span>
            <h3>Market Trends</h3>
            <p>Access market information to make informed selling decisions.</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="products-section" id="products">
        <div className="section-heading">
          <span>OUR MARKETPLACE</span>
          <h2>Fresh Agricultural Products</h2>
          <p>Explore products listed by farmers.</p>
        </div>

        <input
          className="search-box"
          type="text"
          placeholder="Search agricultural products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.name}>
              <div className="product-icon">{product.icon}</div>
              <span className="category">{product.category}</span>
              <h3>{product.name}</h3>
              <p className="price">₹{product.price} <small>/ {product.unit}</small></p>
              <button onClick={() => alert("Please login as a buyer to place an order.")}>
                View Product →
              </button>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p className="no-products">No matching products found.</p>
          )}
        </div>
      </section>

      {/* About */}
      <section className="about-section" id="about">
        <div>
          <span>OUR MISSION</span>
          <h2>Supporting Farmers, Empowering Buyers</h2>
          <p>
            AgriMarket is designed to make agricultural trading simpler
            and more transparent. Farmers can list their produce,
            manage sales and connect with buyers through one platform.
          </p>
        </div>
        <div className="about-icon">🌱</div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <h2>🌾 AgriMarket</h2>
        <p>Connecting farmers and buyers for a better agricultural future.</p>
        <p>© 2026 AgriMarket. College Project.</p>
      </footer>

    </div>
  );
}

export default Home;
