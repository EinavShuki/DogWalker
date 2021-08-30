import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SignUp from "../components/SignUp/SignUp";
import talking_dog from "../img/talking_dog.png";

const DogWalkerScreen = () => {
  const [signUp, setSignUp] = useState(false);
  const history = useHistory();

  const signUpHandler = () => {
    setSignUp(true);
  };
  const loginHandler = () => {
    history.push("/login");
  };

  return (
    <div className="container_dogwalker">
      <div className="dogwalker_div">
        <div className="talking_dog">
          <img src={talking_dog} alt="dog_picture" />
          <h3>
            A DogWalker is a great responsibility, along with the joy that comes
            with the job. Be patient and kind, and don't forget to have fun!
          </h3>
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

export default DogWalkerScreen;
