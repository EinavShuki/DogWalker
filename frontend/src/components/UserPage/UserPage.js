import React, { useEffect, useState } from "react";
import "./UserPage.css";
import { useStorage } from "../../contexts/StorageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useDb } from "../../contexts/DbContext";
import PopUp from "../PopUp/PopUp";
import { FcPhone } from "react-icons/fc";
import { SiGmail } from "react-icons/si";
import Loader from "../Loader/Loader";

const UserPage = () => {
  const [ImgUrl, setImgUrl] = useState("");
  const [userData, setUserData] = useState({});
  const [genderAddressing, setGenderAddressing] = useState("they have");
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [ImgUrl]);
  const QMarkHoverHandler = () => {
    setShowPopUp(true);
  };

  const QMarkStopHoverHandler = () => {
    setShowPopUp(false);
  };

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
        {loading ? <Loader /> : <img className="user_img" src={ImgUrl} />}
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
            <icons>
              <FcPhone />
            </icons>
            <span> {userData.phone}</span>
          </li>
          <li>
            <icons className="interactiv_icon">
              <SiGmail />
            </icons>
            <span> {currentuser.email}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserPage;
