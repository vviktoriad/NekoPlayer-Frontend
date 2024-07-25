import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./signup.css";
import Theme from "../../components/theme/Theme";
import Swal from "sweetalert2";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Password and confirm password do not match",
      });
      return;
    }

    if (username === "" || password === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Username and password are required",
      });
      return;
    }

    if (password.length < 4) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Password must be at least 4 characters",
      });
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/register",
        requestOptions
      );

      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="theme-navbar">
        <Theme />
      </div>
      <div className="group-30">
        <div className="inner-rectangle">
          <form className="inner-content" onSubmit={handleLogin}>
            <h1 className="title">Sign up</h1>

            <div className="group-20">
              <label className="label" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="input-rectangle"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div className="group-22">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input-rectangle"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="group-21">
              <label className="label" htmlFor="confirm-password">
                Confirm password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="input-rectangle"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <div className="account">
              <a href="/login" className="account-text">
                Already have an account?
              </a>
              <div className="login-button">
                <button className="login-btn" style={{ cursor: "pointer" }}>
                  Sign up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
