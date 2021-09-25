import React, { useRef, useState } from "react";
import "./SignUp.css";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router";

const SignUp = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      // console.log("Passwords do not match");
      setError("Passwords do not match");
    } else {
      try {
        setLoading(true);
        setError("");
        await signup(emailRef.current.value, passwordRef.current.value);
        history.push("/profile");
      } catch (err) {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="sign_up_div_box">
      <h2 className="sign_up_tit">Sign Up</h2>
      <form onSubmit={submitHandler} className="signup_form">
        <input
          autoComplete="on"
          ref={emailRef}
          type="email"
          placeholder="Enter Email"
        />
        <input
          required={true}
          autoComplete="on"
          ref={passwordRef}
          type="password"
          placeholder="Enter password"
        />
        <input
          required={true}
          autoComplete="on"
          ref={passwordConfirmRef}
          type="password"
          placeholder="Confirm password"
        />
        <small>{error}</small>
        <button disabled={loading} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
