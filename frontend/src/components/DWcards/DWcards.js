import React, { useEffect, useState } from "react";
import "./DWcards.css";

import { useDb } from "../../contexts/DbContext";
import { useStorage } from "../../contexts/StorageContext";
import Loader from "../Loader/Loader";
import { FcPhone } from "react-icons/fc";
import { ImWhatsapp } from "react-icons/im";
import { SiGmail } from "react-icons/si";
import bone2 from "../../img/bone2.png";
import axios from "axios";

const DWcards = ({ location }) => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foundCity, setFoundCity] = useState(false);
  const [phoneWithCallingCode, setPhoneWithCallingCode] = useState(0);
  const [message, setMessage] = useState("");

  const [usersPictures, setUsersPictures] = useState({});

  const { getAllUsersFromDb } = useDb();
  const { getFromStorage } = useStorage();

  useEffect(() => {
    setUsersList([]);
    setUsersPictures([]);
    const getUsers = async () => {
      try {
        const res = await getAllUsersFromDb();
        res.forEach((doc) => {
          let tempDoc = doc.data();
          tempDoc.email = doc.id;
          if (location.country) {
            if (tempDoc.country === location.country) {
              if (location.city) {
                if (tempDoc.city === location.city) {
                  setFoundCity(true);
                  setUsersList((prev) => [...prev, tempDoc]);
                  getImgs(tempDoc.email);
                }
              } else {
                setUsersList((prev) => [...prev, tempDoc]);
                getImgs(tempDoc.email);
              }
            }
          }
          //location.country===""
          else {
            setUsersList((prev) => [...prev, tempDoc]);
            getImgs(tempDoc.email);
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();
    if (!foundCity && location.city) {
      //there is no dw from this city
      setMessage("Cannot find a Dog Walker from this city");
      setMessage("");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!foundCity && location.city) {
      //there is no dw from this country
      setMessage("Cannot find a Dog Walker from this city");
    } else if (usersList.length === 0)
      //there is no dw from this city
      setMessage("Cannot find a Dog Walker from this country");
    else setMessage("");
  }, [usersList]); // eslint-disable-line react-hooks/exhaustive-deps

  const getImgs = async (email) => {
    setLoading(true);
    try {
      const res = await getFromStorage(email);

      setUsersPictures((prev) => ({ ...prev, [email]: res }));

      setLoading(false);
    } catch (error) {
      setUsersPictures((prev) => ({ ...prev, [email]: "" }));
    }
  };

  const callingCodeSearch = async (phone, country) => {
    country = country.toLowerCase();
    // const api_key = process.env.REACT_APP_COUNTRYLAYER_API_KEY;
    const options = {
      method: "GET",
      url: `https://restcountries.com/v2/name/${country}`,

      headers: {
        "content-type": "application/json",
      },
    };

    try {
      const { data } = await axios(options);
      let tmpPhone = phone;
      if (tmpPhone[0] !== "+") {
        if (tmpPhone[0] === 0) tmpPhone = Number(tmpPhone);
        setPhoneWithCallingCode(data[0].callingCodes[0] + tmpPhone);
      } else {
        checkCallingNum(tmpPhone);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkCallingNum = async (num) => {
    const tmpCallingNum = num.slice(1, 4);
    const options = {
      method: "GET",
      url: `https://restcountries.com/v2/callingcode/${tmpCallingNum}`,

      headers: {
        "content-type": "application/json",
      },
    };

    try {
      const { data } = await axios(options);
      if (!data.status) setPhoneWithCallingCode(num.slice(1));
      else alert("There was a problem to contact this number via Whatsapp");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (phoneWithCallingCode > 0)
      window.location.href = `https://wa.me/+${phoneWithCallingCode}?text=Hello, I saw your ad on the DogWalker site. Are you available to speak??`;
  }, [phoneWithCallingCode]);

  const genderAddressing = (gender) => {
    switch (gender) {
      case "male":
        return "he has";

      case "female":
        return "she has";

      default:
        return "they have";
    }
  };

  return (
    <>
      <div className="message_dwcards">{message}</div>
      {message === "" && (
        <div className="cards_container">
          <div className="cards">
            {usersList.map((userData, index) => {
              return (
                <div key={userData.email} className="profie_div single_card">
                  <div className="img_profile_page img_search_page">
                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        <img
                          className="user_img"
                          src={
                            usersPictures[`${userData.email}`] === ""
                              ? bone2
                              : usersPictures[`${userData.email}`]
                          }
                          alt="user"
                        />
                      </>
                    )}
                  </div>
                  <div className="user_details">
                    <h3>
                      {userData.userName} is {userData.age} years old , from{" "}
                      {userData.city}, {userData.country}. And that is what{" "}
                      {genderAddressing(userData.gender)} to say:
                      <span className="parenthesis">"{userData.about}"</span>
                    </h3>
                    <h3>Contact info:</h3>
                    <br></br>
                    <ul>
                      <li>
                        <a href={`tel:${userData.phone}`}>
                          {" "}
                          <FcPhone />
                        </a>{" "}
                        {userData.allowWhatsapp && (
                          <>
                            <a
                              onClick={() =>
                                callingCodeSearch(
                                  userData.phone,
                                  userData.country
                                )
                              }
                              // href="#"
                            >
                              <ImWhatsapp className="whatsapp_icon" />
                            </a>
                          </>
                        )}
                        <span> {userData.phone}</span>
                      </li>
                      <li>
                        <a href={`mailto:${userData.email}`}>
                          {" "}
                          <SiGmail />
                        </a>
                        <span> {userData.email}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default DWcards;
