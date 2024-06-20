import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "/src/UserAuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);
      alert("Verification email sent. Please check your inbox.");
      navigate("/clogin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
        }}
      >
        <div
          className="p-4 box"
          style={{
            maxWidth: "400px",
            width: "100%",
            border: "2px solid lightblue",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h2 className="mb-3">Signup</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="bg-blue-700 text-white font-semibold px-5 py-2 rounded hover:bg-black transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </Form>
        </div>
        <div
          className="p-4 box mt-3 text-center"
          style={{
            maxWidth: "400px",
            margin: "10px auto",
            border: "2px solid lightblue",
            borderRadius: "10px",
          }}
        >
          Already have an account? <Link to="/clogin">Log In</Link>
        </div>
      </div>
    </>
  );
};

export default Register;
