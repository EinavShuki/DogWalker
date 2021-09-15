import React, { useContext } from "react";
import { createContext } from "react";
import { db } from "../firebase";

const DbContext = createContext();

export const useDb = () => {
  return useContext(DbContext);
};

export const DbProvider = ({ children }) => {
  const uploadToDb = (
    email,
    userName,
    gender,
    age,
    phone,
    allowWhatsapp,
    country,
    city,
    lan,
    lat,
    about
  ) => {
    return db.collection("users").doc(email).set({
      userName,
      gender,
      age,
      phone,
      allowWhatsapp,
      country,
      city,
      lan,
      lat,
      about,
    });
  };

  //get data from doc about specific user
  const getFromDb = (email) => {
    var dbRef = db.collection("users").doc(email);
    return dbRef.get();
  };

  const getAllUsersFromDb = () => {
    var dbRef = db.collection("users");
    return dbRef.get();
  };

  const value = { uploadToDb, getFromDb, getAllUsersFromDb };

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
};
