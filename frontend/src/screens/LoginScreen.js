import React from "react";
import Login from "../components/Login/Login";
import dogBall from "../img/dogBall.png";

const LoginScreen = () => {
  return (
    <div className="login_screen_div">
      <img src={dogBall} alt="dog with a ball" />
      <Login />
    </div>
  );
};

export default LoginScreen;
