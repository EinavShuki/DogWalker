import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SignUp from "../components/SignUp/SignUp";
import dogpic from "../img/dog.png";

const EnterScreen = () => {
  const [signUp, setSignUp] = useState(false);
  const history = useHistory();
  const signUpHandler = () => {
    setSignUp(true);
  };
  const loginHandler = () => {
    history.push("/login");
  };

  return (
    <div className="container">
      <div className="welcome_div">
        <div className="pic_div">
          <img src={dogpic} alt="dog pic" />
        </div>
        <span>
          <h1>Welcome to DogWalker</h1>
          <h3>
            Here you can find the perfect dog walker
            <br></br> or sign up as one
          </h3>
        </span>
        <div className="paws">
          <i className="fas fa-paw one"></i>
          <i className="fas fa-paw two"></i>
          <i className="fas fa-paw three"></i>
        </div>
      </div>
      {signUp ? (
        <SignUp />
      ) : (
        <div className="sign_in_div">
          <button onClick={loginHandler}>Log in</button>
          <button onClick={signUpHandler}>Sign up</button>
        </div>
      )}
    </div>
  );
};

export default EnterScreen;
