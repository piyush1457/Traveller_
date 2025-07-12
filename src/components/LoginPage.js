import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); 
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div style={styles.container}>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>
          <form onSubmit={handleAuth} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
          <p>
            {isSignup ? "Already have an account?" : "You look new"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} style={styles.toggleBtn}>
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
    </div>
    </div>
  );
}

// Optional: Simple inline styles
const styles = {
  container: {
    width: "300px",
    margin: "auto",
    marginTop: "100px",
    textAlign: "center",
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "8px",
    fontSize: "14px"
  },
  button: {
    padding: "10px",
    backgroundColor: "#1d72b8",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
  toggleBtn: {
    background: "none",
    color: "#1d72b8",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline"
  }
};
