import React from "react";

const HomeScreen = () => {
  return (
    <div className="home_screen_div">
      <div className="search_div">
        <form>
          <title>Search the perfect DogWalker</title>
          <label>city</label>

          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
};

export default HomeScreen;
