import React, { useContext } from "react";
import { createContext } from "react";
import { db } from "../firebase";

const DbContext = createContext();

export const useDb = () => {
  return useContext(DbContext);
};

export const DbProvider = ({ children }) => {
  //creating "one" doc
  const uploadToDb = (
    email,
    userName,
    gender,
    age,
    phone,
    country,
    city,
    about
  ) => {
    return db.collection("users").doc(email).set({
      userName,
      gender,
      age,
      phone,
      country,
      city,
      about,
    });
  };

  //get data from doc
  const getFromDb = (email) => {
    var dbRef = db.collection("users").doc("one");

    return dbRef.get();
  };

  const value = { uploadToDb, getFromDb };

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
};
