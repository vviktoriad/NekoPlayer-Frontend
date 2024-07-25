import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import AppContext from "../../AppContext";
import Theme from "../../components/theme/Theme";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/login",
        requestOptions
      );

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "ADD_TOKEN", payload: data });
        localStorage.setItem("token", data.access_token);
        dispatch({
          type: "SET_CURRENT_SONG",
          payload: {
            id: -1,
            title: "",
            cover: "",
            file: "",
          },
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged in",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/main");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Invalid username or password",
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="login-container">
      <div className="theme-navbar">
        <Theme />
      </div>
      <div className="group-31">
        <div className="rectangle-5"></div>
        <div className="inner-rectangle">
          <form className="inner-content" onSubmit={handleLogin}>
            <h1 className="title">Log in</h1>

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

            <div className="account">
              <a href="/" className="account-text">
                Don’t have an account?
              </a>
              <div className="signup-button">
                <button className="rejest-btn" style={{ cursor: "pointer" }}>
                  Log in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
