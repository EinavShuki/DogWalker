import React, { useEffect, useRef, useState } from "react";
import "./UserDetails.css";
import axios from "axios";
import { useStorage } from "../../contexts/StorageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useDb } from "../../contexts/DbContext";
import { useHistory } from "react-router";
import bone2 from "../../img/bone2.png";
import Loader from "../Loader/Loader";

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
  const [countryValid, setCountryValid] = useState("");
  const [cityValid, setCityValid] = useState("");

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
    checkCountryValidation(null);
    checkCityValidation(null);
  };

  //after locate User and ypdate lan&lat I determine his/her city and country
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

  //user start to type country on his/her own
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

  // user start to type city  on his/her own
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

    //update name
    promises.push(updateProfile(nameRef.current.value));
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
        lan,
        lat,
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
        console.log(res);
        setImgUrl(res);
      } catch (error) {
        setImgUrl("");
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
          // console.log(res.data());
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

  const checkCountryValidation = (e) => {
    if (!e || e.key === "Unidentified") {
      countries.forEach((country) => {
        if (country.name === countryRef.current.value) {
          setCountryValid("");
        }
      });
    } else {
      setCountryValid("Country is not valid-Please pick from the list");
    }
  };

  const checkCityValidation = (e) => {
    if (!e || e.key === "Unidentified") {
      cities.forEach((city) => {
        if (city.name === cityRef.current.value) {
          setCityValid("");
        }
      });
    } else {
      setCityValid("City is not valid-Please pick from the list");
    }
  };
  return (
    <div className="update_user_details_div">
      <form onSubmit={submitHandler} className="profile_form">
        <div className="img_profile">
          {!loading ? (
            <img
              className="user_img"
              src={ImgUrl === "" ? bone2 : ImgUrl}
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
            onKeyDown={(e) => checkCountryValidation(e)}
          ></input>

          <datalist required={true} id="countries_list">
            {countries.map((country) => {
              return <option key={country.code}>{country.name}</option>;
            })}
          </datalist>
        </span>
        <small>{countryValid}</small>
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
            onKeyDown={(e) => checkCityValidation(e)}
          />
          <datalist required={true} id="cities_list">
            {cities.map((city) => {
              return <option key={city.id}>{city.city}</option>;
            })}
          </datalist>
        </span>
        <small>{cityValid}</small>
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
