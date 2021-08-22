import React, { useEffect, useState } from "react";
import UserPage from "../components/UserPage/UserPage";
import { useDb } from "../contexts/DbContext";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router";

const ProfileScreen = () => {
  const [userExists, setUserExists] = useState(false);

  const history = useHistory();
  const { getFromDb } = useDb();
  const { currentuser } = useAuth();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await getFromDb(currentuser.email);
        setUserExists(res.data() && true);

        if (!res.data()) history.push("/user-details");
      } catch (error) {
        console.error(error);
      }
    };
    getDetails();
  }, []);

  return <div className="profile_screen_div">{userExists && <UserPage />}</div>;
};

export default ProfileScreen;
