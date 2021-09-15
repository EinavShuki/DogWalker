import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DropDown from "./DropDown/DropDown";

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [loginOrSignUp, setLoginOrSignUp] = useState("Log In");
  const [currentPage, setCurrentPage] = useState("");
  const { currentuser, logout } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (currentuser) setIsLogin(true);
    else setIsLogin(false);
  }, [currentuser]);
  const logoutHandler = async () => {
    try {
      setError("");
      await logout();
      history.push("/");
    } catch (err) {
      setError("Log out Failed");
    }
  };

  useEffect(() => {
    setCurrentPage(window.location.href.split("/").splice(-1)[0]);
  }, []);

  useEffect(() => {
    if (currentPage === "login") setLoginOrSignUp("Sign Up");
    else setLoginOrSignUp("Log In");
  }, [currentPage]);
  return (
    <div id="header_nav">
      <Link className="header_link" to="/">
        <i className="fas fa-home"></i>
      </Link>
      {isLogin ? (
        <div
          className={
            showDropDown ? "right_nav_side_dropdown" : "right_nav_side"
          }
          onMouseEnter={() => {
            setShowDropDown(true);
          }}
        >
          {currentuser && currentuser.displayName && (
            <Link className="header_link" to="/profile">
              {currentuser.displayName}
            </Link>
          )}
          <span
            onMouseLeave={() => {
              setShowDropDown(false);
            }}
          >
            <DropDown />
          </span>
          |<h3 onClick={logoutHandler}> Log Out</h3>
        </div>
      ) : (
        <Link
          className="header_link"
          to={currentPage === "login" ? "/signup" : "/login"}
        >
          {loginOrSignUp}
        </Link>
      )}
      {error}
    </div>
  );
};

export default Header;
