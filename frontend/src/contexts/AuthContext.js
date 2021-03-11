import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
//import auth module from firebase.js we created
import { auth } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  //sign up to site
  const signup = (email, password) => {
    //firebase method of auth -I chose email and password method-returning a promise
    return auth.createUserWithEmailAndPassword(email, password);
  };

  //login to site
  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };
  //logout from site
  const logout = () => {
    return auth.signOut();
  };

  //forget password
  const forgetPass = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  //update user data
  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    //each time we call createUserWithEmailAndPassword it will call this function and set the user for us in DB
    const unsubscribed = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribed;
  }, []);

  //valuse we provise in our custom hook -auth
  const value = {
    currentUser,
    signup,
    login,
    logout,
    forgetPass,
    updateEmail,
    updatePassword,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
