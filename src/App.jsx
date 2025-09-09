import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./App.css";

const STORAGE_KEY = "Bircube's Budget Calculator";
const BUDGET_LIMIT = 50000;

const initialExpenses = {
  officeSupplies: "",
  bills: "",
  travel: "",
  food: "",
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
    if (password !== "Bircube123") {
      setError("Password is incorrect");
      return;
    }
    setError(null);
    onLogin(budgetHolder.trim());
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      {/* Outer container div outside login items */}
      <div className="login-container">
        <Typography variant="h5" gutterBottom>
          Bircube Budget Login
        </Typography>
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
            <div style={{ color: "#ff1744", marginBottom: 10, fontWeight: "600" }}>
              {error}
            </div>
          )}
          <button className="button" type="submit">
            Login
          </button>
        </form>
      </div>
    </Box>
  );
}


function ExpensesPage({ user }) {
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
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <Typography variant="h6">
          Hello, <strong>{user}</strong>
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <label htmlFor="monthSelect">Select Month and Year</label>
        <input
          id="monthSelect"
          type="month"
          value={dateMonth}
          onChange={(e) => setDateMonth(e.target.value)}
          style={{ marginLeft: 10 }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "nowrap" }}>
        {Object.keys(expenses).map((key) => (
          <Box key={key} sx={{ flex: "1 1 150px" }}>
            <label>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={expenses[key]}
              onChange={(e) => handleExpenseChange(e, key)}
              placeholder="Amount in PKR"
              style={{ width: "100%" }}
            />
          </Box>
        ))}
      </Box>

      {exceedLimit && (
        <Box sx={{ color: "#d32f2f", fontWeight: "600", mt: 2 }}>
          Alert: Budget limit of Rs 50,000 has been exceeded!
        </Box>
      )}
    </Box>
  );
}

function ChartPage({ user }) {
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
  }, [expenses]);

  const getBarWidth = (amount) => {
    if (total === 0) return 0;
    return Math.min((amount / total) * 100, 100);
  };

  const colors = {
    officeSupplies: "#3f51b5",
    bills: "#ff9800",
    travel: "#4caf50",
    food: "#e91e63",
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <label htmlFor="monthSelect">Select Month and Year</label>
        <input
          id="monthSelect"
          type="month"
          value={dateMonth}
          onChange={(e) => setDateMonth(e.target.value)}
          style={{ marginLeft: 10 }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Total Expenses: Rs {total.toFixed(2)}
      </Typography>

      {exceedLimit && (
        <Box sx={{ color: "#d32f2f", fontWeight: "600", mb: 2 }}>
          Alert: Budget limit of Rs 50,000 has been exceeded!
        </Box>
      )}

      <Box>
        {Object.entries(expenses).map(([key, val]) => {
          const amount = parseFloat(val) || 0;
          const widthPercent = getBarWidth(amount);
          return (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}{" "}
                : Rs {amount.toFixed(2)}
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#e0e0e0",
                  height: 20,
                  borderRadius: 1,
                  overflow: "hidden",
                }}
                aria-label={`${key} expense bar`}
              >
                <Box
                  sx={{
                    width: `${widthPercent}%`,
                    backgroundColor: colors[key],
                    height: "100%",
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>

      <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
        Monthly budget limit: Rs 50,000
      </Typography>
    </Box>
  );
}

function LogoutPage({ onLogout }) {
  return (
    <Box sx={{ mt: 8, textAlign: "center" }}>
      <div className="logout">
      <Typography variant="h5" gutterBottom>
        Are you sure you want to logout?
      </Typography>
      <Button variant="contained" color="primary" onClick={onLogout}>
        Confirm Logout
      </Button>
      </div>
    </Box>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Login");

  const handleLogin = (budgetHolder) => {
    setUser(budgetHolder);
    setSelectedMenu("Expenses");
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedMenu("Login");
    setSidebarOpen(false);
  };

  const handleMenuClick = (menu) => {
    if (menu === "Logout") {
      setSelectedMenu("Logout");
    } else {
      setSelectedMenu(menu);
    }
    setSidebarOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Bircube Budget Calculator
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem
              button
              selected={selectedMenu === "Login"}
              onClick={() => handleMenuClick("Login")}
            >
              <ListItemText primary="Login" />
            </ListItem>
            {user && (
              <>
                <ListItem
                  button
                  selected={selectedMenu === "Expenses"}
                  onClick={() => handleMenuClick("Expenses")}
                >
                  <ListItemText primary="Expenses" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedMenu === "Chart"}
                  onClick={() => handleMenuClick("Chart")}
                >
                  <ListItemText primary="Chart" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedMenu === "Logout"}
                  onClick={() => handleMenuClick("Logout")}
                >
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      <Box sx={{ p: 2 }}>
        {selectedMenu === "Login" && <Login onLogin={handleLogin} />}
        {selectedMenu === "Expenses" && user && <ExpensesPage user={user} />}
        {selectedMenu === "Chart" && user && <ChartPage user={user} />}
        {selectedMenu === "Logout" && <LogoutPage onLogout={handleLogout} />}
      </Box>
    </>
  );
}
