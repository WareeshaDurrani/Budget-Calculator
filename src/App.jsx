import React, { useState } from "react";
import "./App.css";

function Login({ onLogin }) {
  const [budgetHolder, setBudgetHolder] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!budgetHolder.trim()) {
      setError("Please enter the budget holder's name");
      return;
    }
    if (password !== "bircube123") {
      setError("Password is incorrect");
      return;
    }
    setError(null);
    onLogin(budgetHolder.trim());
  };

  return (
    <div className="login-container">
      <h2>Bircube Budget Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="label">Budget Holder</label>
          <input
            className="input"
            type="text"
            value={budgetHolder}
            onChange={(e) => setBudgetHolder(e.target.value)}
            placeholder="Name"
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {error && (
          <div
            style={{
              color: "#ff1744",
              marginBottom: 10,
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}
        <button className="button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (budgetHolder) => {
    setUser(budgetHolder);
  };

  return user ? (
    <div>
      <h2>Welcome, {user}!</h2>
      { }
    </div>
  ) : (
    <Login onLogin={handleLogin} />
  );
}
