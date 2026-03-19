import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin, switchToRegister }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError(""); // clear old error

      const res = await axios.post(
        "https://finsight-backend-oa0q.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      onLogin();

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
<div className="login-container">
  <div className="logo-box-auth">
  <div className="logo-text-auth">
    Fin<span>Sight</span>
  </div>

  <p className="logo-tagline-auth">
    Smart Personal Finance Engine
  </p>
</div>
  <h2 className="login-title">Login</h2>
  <p style={{ color: "#777", fontSize: "14px", marginBottom: "10px" }}> Welcome back, you've been missed ✨</p>
  <input
    className="login-input"
    placeholder="Email"
    value={email}
    onChange={e => setEmail(e.target.value)}
  />

  <input
    className="login-input"
    type="password"
    placeholder="Password"
    value={password}
    onChange={e => setPassword(e.target.value)}
  />

  {/* 🔴 ERROR MESSAGE */}
  {error && <p className="login-error">{error}</p>}

  <button className="login-btn" onClick={handleLogin}>
    Login
  </button>

  <p className="login-switch" onClick={switchToRegister}>
    Don't have an account? Register
  </p>

</div>
  );
}