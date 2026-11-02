
import { useState } from "react";
import { login } from "../storage";

export default function Login({ onLogin, onSignup }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = login(form.email, form.password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-icon">🌾</div>

        <h1>Welcome Back!</h1>
        <p>Login to your AgriMarket account</p>

        <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            required
            value={form.password}
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="auth-submit">
            Login
          </button>
        </form>

        <p className="auth-bottom">
          Don't have an account?
          <button onClick={onSignup}>Sign Up</button>
        </p>
      </div>
    </div>
  );
}
