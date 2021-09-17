import axios from "axios";
import React, { useRef, useState } from "react";
import DWcards from "../DWcards/DWcards";
import "./SearchField.css";

const SearchField = () => {
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [smallMassege, setSmallMassege] = useState("");
  const [dispatchLocation, setDispatchLocation] = useState({});

  const countryRef = useRef();
  const cityRef = useRef();

  const countrySearch = async () => {
    if (countryRef.current.value === "") setCountryId("");
    setSmallMassege("");
    setCountries([]);
    setCities([]);
    cityRef.current.value = "";
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
      //   console.log(data.data);
      if (data.data.length === 1) {
        setCountryId(data.data[0].wikiDataId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const citySearch = async () => {
    if (countryId === "") {
      setSmallMassege("Choose a country first please");
      cityRef.current.value = "";
    }

    setCities([]);
    if (cityRef.current.value.length > 2) {
      const options = {
        method: "GET",
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        params: {
          limit: "10",
          countryIds: countryId,
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
        // console.log(data.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setDispatchLocation({
      city: cityRef.current.value,
      country: countryRef.current.value,
    });
  };

  return (
    <div>
      <form className="searchfield_form">
        <input
          placeholder="Type and choose a country from the list"
          list="countries_list"
          ref={countryRef}
          onChange={countrySearch}
        />
        <datalist required={true} id="countries_list">
          {countries.map((country) => {
            return <option key={country.code}>{country.name}</option>;
          })}
        </datalist>
        <input
          placeholder="Type and choose a city from the list"
          list="cities_list"
          ref={cityRef}
          onChange={citySearch}
        />
        <datalist required={true} id="cities_list">
          {cities.map((city) => {
            return <option key={city.id}>{city.city}</option>;
          })}
        </datalist>
        <button onClick={(e) => submitHandler(e)}>Submit</button>
        <small>{smallMassege}</small>
      </form>
      <DWcards
        location={dispatchLocation}
        key={dispatchLocation.city + dispatchLocation.country} //to rerender component with submitting
      />{" "}
    </div>
  );
};

export default SearchField;
