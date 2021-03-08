import React from "react";
import "./SignUp.css";
const SignUp = () => {
  return (
    <div>
      <form className="signup_form">
        <input placeholder="Enter user name" />
        <input placeholder="Enter Email" />
        <input placeholder="Enter password" />
        <input placeholder="Confirm password" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignUp;
