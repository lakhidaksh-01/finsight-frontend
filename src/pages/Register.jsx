import { useState } from "react";
import axios from "axios";

export default function Register({ onRegisterSuccess, switchToLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ NEW STATE
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    try {
      setError("");
      setSuccess("");

      // ✅ CHECK PASSWORD MATCH
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      setSuccess("Account created successfully 🎉");

      setTimeout(() => {
        onRegisterSuccess();
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="logo-box-auth">
  <div className="logo-text-auth">
    Fin<span>Sight</span>
  </div>

  <p className="logo-tagline-auth">
    Smart Personal Finance Engine
  </p>
</div>
      <h2 className="register-title">Register</h2>
<p style={{ color: "#777", fontSize: "14px", marginBottom: "10px" }}>
  Create your account to get started 🚀
</p>
      <input
        className="register-input"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="register-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {/* ✅ NEW INPUT */}
      <input
        className="register-input"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />

      {/* 🔴 ERROR */}
      {error && <p className="register-error">{error}</p>}

      {/* 🟢 SUCCESS */}
      {success && <p className="register-success">{success}</p>}

      <button className="register-btn" onClick={handleRegister}>
        Register
      </button>

      <p className="register-switch" onClick={switchToLogin}>
        Already have an account? Login
      </p>
    </div>
  );
}