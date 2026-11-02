import AdminDashboard from "./pages/AdminDashboard";
import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";

import { getSession, logout } from "./storage";

function App() {
  const [user, setUser] = useState(getSession());
  const [page, setPage] = useState("home");

  function handleLogin(session) {
    setUser(session);
    setPage("dashboard");
  }

  function handleSignup(session) {
    setUser(session);
    setPage("dashboard");
  }

  function handleLogout() {
    logout();
    setUser(null);
    setPage("home");
  }

  // Farmer Dashboard
  if (user && page === "dashboard" && user.role === "farmer") {
    return (
      <FarmerDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (user && page === "dashboard" && user.role === "buyer") {
    return (
      <BuyerDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Admin Dashboard
if (user && page === "dashboard" && user.role === "admin") {
  return (
    <AdminDashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}

  if (page === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onSignup={() => setPage("signup")}
      />
    );
  }

  if (page === "signup") {
    return (
      <Signup
        onSignup={handleSignup}
        onLogin={() => setPage("login")}
      />
    );
  }

  return (
    <Home
      onLogin={() => setPage("login")}
      onSignup={() => setPage("signup")}
    />
  );
}

export default App;
