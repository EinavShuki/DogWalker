import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentuser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentuser ? <Component {...props} /> : <Redirect to="/" />;
      }}
    ></Route>
  );
};

export default PrivateRoute;
