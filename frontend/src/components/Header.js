import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (currentUser) setIsLogin(true);
    else setIsLogin(false);
  }, [currentUser]);
  const logoutHandler = async () => {
    try {
      setError("");
      await logout();
      history.push("/");
    } catch (err) {
      setError("Log out Failed");
    }
  };
  return (
    <div id="header_nav">
      <Link to="/home">
        <i className="fas fa-home"></i>
      </Link>
      {isLogin ? (
        <div className="right_nav_side">
          {currentUser && currentUser.displayName && (
            <Link to="/profile">{currentUser.displayName}</Link>
          )}
          | <h4 onClick={logoutHandler}> Log Out</h4>
        </div>
      ) : (
        <Link to="/login">Log In</Link>
      )}
      {error}
    </div>
  );
};

export default Header;
