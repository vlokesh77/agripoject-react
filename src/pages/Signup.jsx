
import { useState } from "react";
import { signup } from "../storage";

export default function Signup({ onSignup, onLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer"
  });

  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    try {
      const user = signup(form);
      onSignup(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-icon">🌾</div>

        <h1>Create Account</h1>
        <p>Join the AgriMarket community</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            required
            value={form.name}
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={form.email}
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Minimum 6 characters"
            required
            value={form.password}
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <label>Select Account Type</label>
          <select
            value={form.role}
            onChange={e =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="auth-submit">
            Create Account
          </button>
        </form>

        <p className="auth-bottom">
          Already have an account?
          <button onClick={onLogin}>Login</button>
        </p>
      </div>
    </div>
  );
}
