import { useHistory } from "react-router-dom";
import React from "react";
import dogpic from "../img/dog.png";

const HomeScreen = () => {
  const history = useHistory();
  const dogWalker = () => {
    history.push("/dogWalker");
  };
  const dogWalkerSeeker = () => {
    history.push("/");
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

      <div className="user_type_div">
        <button onClick={dogWalkerSeeker}>I seek for a DogWalker</button>
        <button onClick={dogWalker}>I am a DogWalker</button>
      </div>
    </div>
  );

  // <div className="home_screen_div"></div>;
};

export default HomeScreen;
