import React from "react";
import "./Loader.css";
import bone from "../../img/bone.png";

const Loader = () => {
  return (
    <div className="lds-hourglass">
      <img src={bone} alt="" />
    </div>
  );
};

export default Loader;
