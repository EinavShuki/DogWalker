import React from "react";
import { Link } from "react-router-dom";

import "./DropDown.css";

const DropDown = () => {
  return (
    <div className="dropdown">
      <div className="dropdown-content">
        <Link to="/update">Change login info</Link>
        <Link to="/user-details">Update account info</Link>
      </div>
    </div>
  );
};

export default DropDown;
