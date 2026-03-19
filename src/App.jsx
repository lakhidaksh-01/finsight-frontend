import { useState, useEffect } from "react";
import axios from "axios";

import Header from "./components/Header";
import StatsRow from "./components/StatsRow";
import NewExpenseForm from "./components/NewExpenseForm";
import ChartPanel from "./components/ChartPanel";
import ExpenseList from "./components/ExpenseList";
import TrustBar from "./components/TrustBar";
import AIInsights from "./components/AIInsights";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PredictionChart from "./components/PredictionChart";

export default function App() {

  const [expenses, setExpenses] = useState([]);

  // ✅ keep login state from localStorage
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  const [isLogin, setIsLogin] = useState(true);

  // -----------------------------
  // GOOGLE LOGIN TOKEN HANDLING
  // -----------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setLoggedIn(true);
      window.history.replaceState({}, document.title, "/"); // clean URL
    }
  }, []);

  // -----------------------------
  // FETCH EXPENSES
  // -----------------------------
  useEffect(() => {
    if (!loggedIn) return;

    const fetchExpenses = async () => {
      try {
        console.log("TOKEN:", localStorage.getItem("token")); // debug

        const res = await axios.get("http://localhost:5000/api/expenses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setExpenses(res.data);

      } catch (err) {
        console.log("FETCH ERROR:", err.response?.data || err.message);

        // ❗ only logout if token is invalid
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          setLoggedIn(false);
        }
      }
    };

    fetchExpenses();
  }, [loggedIn]);

  // -----------------------------
  // ADD EXPENSE
  // -----------------------------
  const addExpense = async (exp) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/expenses",
        exp,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setExpenses([res.data, ...expenses]);

    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
    }
  };

  // -----------------------------
  // DELETE EXPENSE
  // -----------------------------
  const deleteExpense = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setExpenses(expenses.filter(e => e._id !== id));

    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
    }
  };

  // -----------------------------
  // CLEAR ALL EXPENSES
  // -----------------------------
  const handleClearAll = async () => {
    try {
      await axios.delete(
        "http://localhost:5000/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setExpenses([]);

    } catch (err) {
      console.log("CLEAR ERROR:", err.response?.data || err.message);
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  // -----------------------------
  // AUTH SCREEN
  // -----------------------------
  if (!loggedIn) {
    return (
      <div style={{ padding: "40px" }}>
        {isLogin ? (
          <Login
            onLogin={() => setLoggedIn(true)}
            switchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <Register
            onRegisterSuccess={() => setLoggedIn(true)}
            switchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    );
  }

  // -----------------------------
  // MAIN APP
  // -----------------------------
  return (
    <div className="app">

      <Header />

      <div className="layout">
        <div className="left">
          <StatsRow expenses={expenses} />
          <NewExpenseForm onAdd={addExpense} />
          <AIInsights expenses={expenses} />
        </div>

        <div className="right">
          <ChartPanel expenses={expenses} />
          <PredictionChart expenses={expenses} />
          <ExpenseList
            expenses={expenses}
            onDelete={deleteExpense}
            onClearAll={handleClearAll}
          />
        </div>
      </div>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <TrustBar />
    </div>
  );
}