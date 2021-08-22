import React, { useRef, useState } from "react";
import "./Login.css";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      // console.log(res);
      history.push("/profile");
    } catch (err) {
      if (
        err.message ===
        "There is no user record corresponding to this identifier. The user may have been deleted."
      )
        setError("User does not exist");
      else if (
        err.message ===
        "The password is invalid or the user does not have a password."
      ) {
        setError("Wrong password");
      } else setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login_div">
      <h2 className="login_tit">Log In</h2>
      <form onSubmit={submitHandler} className="signup_form">
        <input
          autoComplete="on"
          ref={emailRef}
          type="email"
          placeholder="Enter Email"
        />
        <input
          autoComplete="on"
          ref={passwordRef}
          type="password"
          placeholder="Enter password"
        />
        <span className="pass_prob">
          <small>{error}</small>
          <Link className="forget_link" to="/forget-password">
            Forgot passward
          </Link>
        </span>
        <button disabled={loading} type="submit">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
