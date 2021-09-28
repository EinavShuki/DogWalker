import React, { useEffect, useState } from "react";
import "./UserPage.css";
import { useStorage } from "../../contexts/StorageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useDb } from "../../contexts/DbContext";
import PopUp from "../PopUp/PopUp";
import { FcPhone } from "react-icons/fc";
import { SiGmail } from "react-icons/si";
import { ImWhatsapp } from "react-icons/im";
import Loader from "../Loader/Loader";
import bone2 from "../../img/bone2.png";
import axios from "axios";

const UserPage = () => {
  const [ImgUrl, setImgUrl] = useState("");
  const [userData, setUserData] = useState({});
  const [genderAddressing, setGenderAddressing] = useState("they have");
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phoneWithCallingCode, setPhoneWithCallingCode] = useState(0);

  const { currentuser } = useAuth();
  const { getFromDb } = useDb();
  const { getFromStorage } = useStorage();

  useEffect(() => {
    const getImg = async () => {
      setLoading(true);
      try {
        const res = await getFromStorage(currentuser.email);
        setImgUrl(res);
      } catch (error) {
        setImgUrl("");
        setLoading(false);
        console.error(error);
      }
    };
    const getDetails = async () => {
      try {
        const res = await getFromDb(currentuser.email);

        if (res.data()) {
          setUserData(res.data());
        }
        switch (res.data().gender) {
          case "male":
            setGenderAddressing("he has");
            break;
          case "female":
            setGenderAddressing("she has");
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }
    };
    getDetails();
    getImg();
  }, []);

  useEffect(() => {
    if (ImgUrl !== "") {
      setLoading(false);
    }
  }, [ImgUrl]);
  const QMarkHoverHandler = () => {
    setShowPopUp(true);
  };

  const QMarkStopHoverHandler = () => {
    setShowPopUp(false);
  };

  const callingCodeSearch = async (country) => {
    setPhoneWithCallingCode([]);
    country = country.toLowerCase();
    const options = {
      method: "GET",
      url: `https://restcountries.com/v2/name/${country}`,

      headers: {
        "content-type": "application/json",
      },
    };

    try {
      const { data } = await axios(options);
      let tmpPhone = userData.phone;
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

  return (
    <div className="profie_div">
      <div className="question_mark_user_page">
        <i
          className="far fa-question-circle fa-lg"
          onMouseOver={QMarkHoverHandler}
          onMouseOut={QMarkStopHoverHandler}
        ></i>
        {showPopUp && <PopUp />}
      </div>
      <div className="img_profile_page">
        {loading ? (
          <Loader />
        ) : (
          <img
            className="user_img"
            src={ImgUrl === "" ? bone2 : ImgUrl}
            atl="user"
          />
        )}
      </div>
      <div className="user_details">
        <h3>
          {userData.userName} is {userData.age} years old , from {userData.city}
          , {userData.country}. And that is what {genderAddressing} to say:
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
              <a
                onClick={() => callingCodeSearch(userData.country)}
                // href={`https://wa.me/+${phoneWithCallingCode}?text=Hello, I saw your ad on the DogWalker site. Are you available to speak??`}
              >
                <ImWhatsapp className="whatsapp_icon" />
              </a>
            )}
            <span> {userData.phone}</span>
          </li>
          <li>
            <a href={`mailto:${currentuser.email}`}>
              {" "}
              <SiGmail />
            </a>
            <span> {currentuser.email}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserPage;
