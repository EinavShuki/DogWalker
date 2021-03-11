import React, { useRef, useState } from "react";
import "./UserDetails.css";
import axios from "axios";
const UserDetails = () => {
  const [cities, setCities] = useState([]);
  // const [citySelected, setCitySelected] = useState(false);

  const nameRef = useRef();
  const ageRef = useRef();
  const genderRef = useRef();
  const locationRef = useRef();
  const PhoneRef = useRef();
  const aboutRef = useRef();

  const clickHandler = async () => {
    if (locationRef.current.value.length > 2)
      try {
        const config = {
          headers: { "Content-Type": "application/json" },
        };
        const { data } = await axios.get(
          `https://data.gov.il/api/3/action/datastore_search?q=${locationRef.current.value}&resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab`,
          config
        );
        console.log(data.result.records);
        setCities(data.result.records);
      } catch (err) {
        console.log(err);
      }
  };
  return (
    <div className="profie_div">
      <div className="img_profile">
        <i className="fas fa-bone"></i>
      </div>
      <form className="profile_form">
        <span>
          <label>Name</label>
          <input autoComplete="on" ref={nameRef} type="text" />
        </span>
        <span>
          <label>male</label>
          <input
            autoComplete="on"
            name="gender"
            ref={genderRef}
            type="radio"
            value="female"
            id="female"
          />
          <label>Female</label>
          <input
            id="male"
            autoComplete="on"
            name="gender"
            ref={genderRef}
            type="radio"
            value="female"
          />
          <label>Other</label>
          <input
            id="other"
            autoComplete="on"
            name="gender"
            ref={genderRef}
            type="radio"
            value="other"
          />
        </span>
        <span>
          <label htmlFor="age">Age</label>
          <input
            min="12"
            id="age"
            autoComplete="on"
            ref={ageRef}
            type="number"
          />
        </span>
        <span>
          <label>City</label>
          <input
            required={true}
            autoComplete="off"
            placeholder="Type and choose"
            list="cities_list"
            ref={locationRef}
            type="text"
            onChange={clickHandler}
          ></input>
          <datalist required={true} id="cities_list">
            {cities.map((city) => {
              return <option key={city._id}>{city.שם_ישוב_לועזי}</option>;
            })}
          </datalist>
        </span>
        <span>
          <label htmlFor="phone">Phone</label>
          <input id="phone" autoComplete="on" ref={PhoneRef} type="tel" />
        </span>
        <span>
          <textarea
            rows="5"
            cols="75"
            id="about"
            placeholder="Tell dogs owners about yourself"
            ref={aboutRef}
          />
        </span>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UserDetails;
