import React, { useContext } from "react";
import { createContext } from "react";
import { storage } from "../firebase";

const StorageContext = createContext();

export const useStorage = () => {
  return useContext(StorageContext);
};

export const StorageProvider = ({ children }) => {
  const uploadToStorage = (file, userEmail) => {
    //root ref
    let storageRef = storage.ref();
    //child ref
    return storageRef.child("photos/" + userEmail).put(file);
  };

  const getFromStorage = (userEmail) => {
    let storageRef = storage.ref();
    return storageRef.child("photos/" + userEmail).getDownloadURL();
  };

  //valuse we provide in our custom hook -storage
  const value = {
    uploadToStorage,
    getFromStorage,
  };
  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};
