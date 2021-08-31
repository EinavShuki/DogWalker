import React, { useEffect, useState } from "react";
import "./DWcards.css";

import { useDb } from "../../contexts/DbContext";
import { useStorage } from "../../contexts/StorageContext";
import Loader from "../Loader/Loader";
import { FcPhone } from "react-icons/fc";
import { ImWhatsapp } from "react-icons/im";
import { SiGmail } from "react-icons/si";
import axios from "axios";

const DWcards = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ImgUrl, setImgUrl] = useState("");
  const [phoneWithCallingCode, setPhoneWithCallingCode] = useState(0);

  const { getAllUsersFromDb } = useDb();
  const { getFromStorage } = useStorage();

  useEffect(() => {
    setUsersList([]);
    const getUsers = async () => {
      try {
        const res = await getAllUsersFromDb();
        res.forEach((doc) => {
          let tempDoc = doc.data();
          tempDoc.email = doc.id;
          setUsersList((prev) => [...prev, tempDoc]);
        });
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();
  }, []);

  const callingCodeSearch = (phone) => {
    axios
      .get("https://restcountries.eu/rest/v2/name/Israel")
      .then(({ data }) => {
        let tmpPhone = phone;
        if (tmpPhone[0] !== "+") {
          if (tmpPhone[0] == 0) tmpPhone = Number(tmpPhone);

          setPhoneWithCallingCode(data[0].callingCodes[0] + tmpPhone);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getImgs = (email) => {
    console.log("boom", email);
    // setLoading(true);
    getFromStorage(email)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setImgUrl(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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
    <div className="cards_container">
      <div className="cards">
        {usersList.map((userData) => {
          return (
            <div key={userData.email} className="profie_div single_card">
              <div className="img_profile_page">
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    {/* {getImgs(userData.email)} */}
                    <img className="user_img" src="" alt="user picture" />
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
                        {callingCodeSearch(userData.phone)}
                        <a
                          href={`https://wa.me/+${phoneWithCallingCode}?text=Hello, I saw your ad on the DogWalker site. Are you available to speak??`}
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
  );
};

export default DWcards;
