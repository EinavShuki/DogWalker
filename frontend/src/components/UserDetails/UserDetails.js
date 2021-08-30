import React, { useEffect, useRef, useState } from "react";
import "./UserDetails.css";
import axios from "axios";
import { useStorage } from "../../contexts/StorageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useDb } from "../../contexts/DbContext";
import { useHistory } from "react-router";
import bone from "../../img/bone.png";
import Loader from "../Loader/Loader";

// import Cropper from "react-easy-crop";

// import { useDispatch, useSelector } from "react-redux";
// import { UpdateUser, fetchCurrentUser } from "../../redux/users";

const UserDetails = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [gender, setGender] = useState("other");
  const [allowWhatsapp, setAllowWhatsapp] = useState(false);
  const [wikiDataId, setWikiDataId] = useState();
  const [selectedImg, setSelectedImg] = useState(null);
  const [ImgUrl, setImgUrl] = useState("");
  const [lat, setLat] = useState("");
  const [lan, setLan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [zoom, setZoom] = useState(1);

  const history = useHistory();

  const { uploadToStorage, getFromStorage } = useStorage();
  const { updateProfile, currentuser } = useAuth();
  const { uploadToDb, getFromDb } = useDb();

  const ageRef = useRef();
  const countryRef = useRef();
  const cityRef = useRef();
  const nameRef = useRef();
  const aboutRef = useRef();
  const phoneRef = useRef();

  //finding user location
  const locateUser = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      if (coords.latitude > 0) setLat("+" + coords.latitude);
      else setLat("-" + coords.latitude);
      if (coords.longitude > 0) setLan("+" + coords.longitude);
      else setLan("-" + coords.longitude);
    });
  };

  useEffect(() => {
    if (lan !== "") {
      const options = {
        method: "GET",
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        params: { location: `${lat}${lan}` },
        headers: {
          "x-rapidapi-key":
            "1bcc8b1472mshc6f6ec1fc9d0725p1aafe6jsnfa31c60995ec",
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      };
      const setLoacation = async () => {
        try {
          const { data } = await axios(options);
          cityRef.current.value = data.data[0].city;
          countryRef.current.value = data.data[0].country;
        } catch (error) {
          console.error(error);
        }
      };
      setLoacation();
    }
  }, [lan]);

  const countrySearch = async () => {
    setCountries([]);
    const options = {
      method: "GET",
      url: "https://wft-geo-db.p.rapidapi.com/v1/geo/countries",
      params: { limit: "10", namePrefix: countryRef.current.value },
      headers: {
        "x-rapidapi-key": "1bcc8b1472mshc6f6ec1fc9d0725p1aafe6jsnfa31c60995ec",
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
      },
    };

    try {
      const { data } = await axios(options);
      setCountries(data.data);
      if (data.data.length === 1) {
        setWikiDataId(data.data[0].wikiDataId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const citySearch = async () => {
    setCities([]);
    if (cityRef.current.value.length > 2) {
      const options = {
        method: "GET",
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        params: {
          limit: "10",
          countryIds: wikiDataId,
          namePrefix: cityRef.current.value,
        },
        headers: {
          "x-rapidapi-key":
            "1bcc8b1472mshc6f6ec1fc9d0725p1aafe6jsnfa31c60995ec",
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      };

      try {
        const { data } = await axios(options);
        setCities(data.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const promises = [];

    //update name and image to current user
    promises.push(updateProfile(nameRef.current.value, ImgUrl));
    //update to db all user's details
    promises.push(
      uploadToDb(
        currentuser.email,
        nameRef.current.value,
        gender,
        ageRef.current.value,
        phoneRef.current.value,
        allowWhatsapp,
        countryRef.current.value,
        cityRef.current.value,
        aboutRef.current.value
      )
    );

    try {
      await Promise.all(promises);
      setError("");
      //redirect to user page
      history.push("/profile");
    } catch (error) {
      setError("There was a problem with updating your data");
    }
  };

  const fileSelectedHandler = (e) => {
    setSelectedImg(e.target.files[0]);
  };

  const uploadHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await uploadToStorage(selectedImg, currentuser.email);
      const res = await getFromStorage(currentuser.email);
      setImgUrl(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getImg = async () => {
      try {
        const res = await getFromStorage(currentuser.email);
        setImgUrl(res);

        if (ImgUrl !== "") {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getImg();
  }, [ImgUrl]);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await getFromDb(currentuser.email);
        if (res.data()) {
          nameRef.current.value = res.data().userName;
          setGender(res.data().gender);
          ageRef.current.value = res.data().age;
          phoneRef.current.value = res.data().phone;
          setAllowWhatsapp(res.data().allowWhatsapp);
          countryRef.current.value = res.data().country;
          cityRef.current.value = res.data().city;
          aboutRef.current.value = res.data().about;
        }
      } catch (error) {
        console.error(error);
      }
    };
    getDetails();
  }, []);

  // const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
  //   console.log(croppedArea, croppedAreaPixels);
  // }, []);

  return (
    <div className="update_user_details_div">
      <form onSubmit={submitHandler} className="profile_form">
        <div className="img_profile">
          {!loading && ImgUrl !== "" ? (
            <img
              className="user_img"
              src={ImgUrl}
              alt={bone}
              draggable="false"
            />
          ) : (
            <Loader />
          )}
          <input id="img" type="file" onChange={fileSelectedHandler} />
          <button
            disabled={selectedImg == null}
            onClick={(e) => uploadHandler(e)}
          >
            Upload
          </button>{" "}
        </div>
        {/* {ImgUrl !== "" && (
          <Cropper
            image={ImgUrl}
            crop={crop}
            zoom={zoom}
            aspect={3 / 3}
            cropShape={"round"}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        )} */}
        <span>
          <label>
            <h3>*</h3>Name
          </label>
          <input required={true} autoComplete="on" ref={nameRef} type="text" />
        </span>
        <span defaultValue={gender} onChange={(e) => setGender(e.target.value)}>
          <label htmlFor="male">male</label>
          <input name="gender" type="radio" value="male" id="male" />
          <label htmlFor="female">Female</label>
          <input id="female" name="gender" type="radio" value="female" />
          <label htmlFor="other">Other</label>
          <input id="other" name="gender" type="radio" value="other" />
        </span>
        <span>
          <label htmlFor="age">
            <h3>*</h3>Age
          </label>
          <input
            required={true}
            min="12"
            id="age"
            autoComplete="on"
            ref={ageRef}
            type="number"
          />
        </span>
        <button onClick={(e) => locateUser(e)}>Locate Me</button>
        <span>
          <label>
            {" "}
            <h3>*</h3>Country
          </label>
          <input
            required={true}
            autoComplete="off"
            placeholder="Type and choose from list"
            list="countries_list"
            ref={countryRef}
            type="text"
            onChange={countrySearch}
          ></input>
          <datalist required={true} id="countries_list">
            {countries.map((country) => {
              return <option key={country.code}>{country.name}</option>;
            })}
          </datalist>
        </span>
        <span>
          <label>
            <h3>*</h3>City
          </label>
          <input
            required={true}
            autoComplete="off"
            placeholder="Type and choose from list"
            list="cities_list"
            ref={cityRef}
            type="text"
            onChange={citySearch}
          />
          <datalist required={true} id="cities_list">
            {cities.map((city) => {
              return <option key={city.id}>{city.city}</option>;
            })}
          </datalist>
        </span>
        <span>
          <label htmlFor="phone">Phone</label>
          <input id="phone" autoComplete="on" ref={phoneRef} type="tel" />
        </span>
        <span className="checkbox">
          <input
            onChange={() => {
              setAllowWhatsapp((prev) => !prev);
            }}
            checked={allowWhatsapp}
            type="checkbox"
            id="whatsapp"
          />
          <span className="checkmark">&#10005;</span>
          <label htmlFor="whatsapp">Allow Whatsapp contact</label>
        </span>
        <span>
          <textarea
            rows="4"
            cols="50"
            id="about"
            maxLength="150"
            placeholder="Tell dogs owners about yourself"
            ref={aboutRef}
          />
        </span>
        <small>{error}</small>
        <button id="submit_user_details" type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default UserDetails;
