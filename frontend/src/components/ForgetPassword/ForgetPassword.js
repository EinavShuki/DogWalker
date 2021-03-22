import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router";
import "./ForgetPassword.css";

const ForgetPassword = () => {
  const [error, setError] = useState("");

  const emailRef = useRef();
  const { forgetPass } = useAuth();
  const history = useHistory();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await forgetPass(emailRef.current.value);
      history.push("/");
    } catch (err) {
      if (
        err.message.match(
          "There is no user record corresponding to this identifier. The user may have been deleted."
        )
      )
        setError("User does not exist");
    }
  };

  return (
    <div className="forget_div">
      <h2 className="forget_tit">Reset Passward</h2>
      <form onSubmit={submitHandler} className="forget_form">
        <input
          autoComplete="on"
          ref={emailRef}
          type="email"
          placeholder="Enter Email"
        />
        <small>{error}</small>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ForgetPassword;
