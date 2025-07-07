import React, { useState } from "react";
import { PageNav } from "../components/PageNav";
import { useNavigate } from "react-router-dom";

export function LoginPage({ setIsLoggedIn, setUserRole }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  function toggleForm() {
    setIsRegistering((prev) => !prev);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.name?.value,
      email: form.email.value,
      password: form.password.value,
    };

    const API_BASE_URL = "http://localhost:4000/api";
    const endpoint = isRegistering
      ? `${API_BASE_URL}/${role}/register`
      : `${API_BASE_URL}/${role}/login`;

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("RESPONSE:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
          setIsLoggedIn(true);
          setUserRole(role);

          alert(
            isRegistering
              ? "Registered successfully!"
              : "Logged in successfully!"
          );

          if (role === "owner") {
            navigate("/restaurant-menu");
          } else {
            navigate("/restaurants");
          }
        } else {
          alert("Something went wrong.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server error.");
      });
  }

  return (
    <div className="auth-page">
      <PageNav isLoggedIn={false} />

      <div className="auth-form">
        <h2>
          {isRegistering ? "Register at TableTime" : "Login to TableTime"}
        </h2>

        <div className="role-toggle">
          <button
            className={role === "user" ? "active" : ""}
            onClick={() => setRole("user")}
            type="button"
          >
            User
          </button>
          <button
            className={role === "owner" ? "active" : ""}
            onClick={() => setRole("owner")}
            type="button"
          >
            Restaurant
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <label>Full Name:</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                required
              />
            </>
          )}

          <label>Email:</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password:</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </form>

        <p className="auth-toggle">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span className="toggle-link" onClick={toggleForm}>
            {isRegistering ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
