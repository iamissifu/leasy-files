import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { database } from "../firebase/firebase.config";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;
    sendPasswordResetEmail(database, emailVal)
      .then((data) => {
        alert("Check your gmail");
        history("/");
      })
      .catch((err) => {
        alert(err.code);
      });
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-blue-100"
    >
      <h1 className="mb-4">Reset Password</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="bg-white p-6 rounded-md shadow-md">
        <input placeholder= "Please enter your email" name="email" className="mb-2 p-2 border border-gray-300 rounded-md" />
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4">Send Link to Reset</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
