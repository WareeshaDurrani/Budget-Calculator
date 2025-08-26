import React, { useState, useEffect } from "react";
import "./App.css";

const BUDGET_LIMIT = 50000;
const STORAGE_KEY = "Bircube's Budget Calculator";

const initialExpenses = {
  officeSupplies: "",
  Bills: "",
  travel: "",
  food: "",
};

const colors = {
  officeSupplies: "#3f51b5",
  salaries: "#ff9800",
  travel: "#4caf50",
  food: "#e91e63",
};

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
    if (password !== "123") {
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

function BudgetCalculator({ user, onLogout }) {
  const [dateMonth, setDateMonth] = useState(new Date().toISOString().slice(0, 7));
  const [expenses, setExpenses] = useState(initialExpenses);
  const [total, setTotal] = useState(0);
  const [exceedLimit, setExceedLimit] = useState(false);

  useEffect(() => {
    const savedDataStr = localStorage.getItem(STORAGE_KEY);
    if (savedDataStr) {
      const savedData = JSON.parse(savedDataStr);
      const key = `${user}-${dateMonth}`;
      if (savedData[key]) {
        setExpenses(savedData[key].expenses);
      } else {
        setExpenses(initialExpenses);
      }
    }
  }, [user, dateMonth]);

  useEffect(() => {
    const vals = Object.values(expenses).map((v) => parseFloat(v) || 0);
    const sum = vals.reduce((acc, cur) => acc + cur, 0);
    setTotal(sum);
    setExceedLimit(sum > BUDGET_LIMIT);

    const savedDataStr = localStorage.getItem(STORAGE_KEY);
    let savedData = {};
    if (savedDataStr) {
      savedData = JSON.parse(savedDataStr);
    }
    const key = `${user}-${dateMonth}`;
    savedData[key] = { expenses };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
  }, [expenses, user, dateMonth]);

  const handleExpenseChange = (e, field) => {
    let val = e.target.value;
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setExpenses({
        ...expenses,
        [field]: val,
      });
    }
  };

  return (
    <div className="container">
      <h1 className="header">Bircube Monthly Budget Calculator</h1>

      <div className="card" style={{ marginBottom: 10, textAlign: "right" }}>
        <div>
          Hello, <strong>{user}</strong>{" "}
          <button onClick={onLogout} className="logout-btn" title="Logout">
            Logout
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 25 }}>
        <div className="input-group">
          <label className="label">Select Month and Year</label>
          <input
            className="input"
            type="month"
            value={dateMonth}
            onChange={(e) => setDateMonth(e.target.value)}
          />
        </div>

        <div className="flex-row">
          {Object.keys(expenses).map((key) => (
            <div className="flex-col" key={key}>
              <label className="label">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                className="input"
                type="text"
                inputMode="decimal"
                value={expenses[key]}
                onChange={(e) => handleExpenseChange(e, key)}
                placeholder="Amount in PKR"
              />
            </div>
          ))}
        </div>
      </div>

      {exceedLimit && (
        <div className="notification">
          Alert: Budget limit of Rs 50,000 has been exceeded!
        </div>
      )}

      <div className="card">
        <h3>Total Expenses: Rs {total.toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (budgetHolder) => {
    setUser(budgetHolder);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return user ? <BudgetCalculator user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
}
