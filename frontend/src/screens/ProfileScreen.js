import React, { useEffect, useState } from "react";
import UserDetails from "../components/UserDetails/UserDetails";
import { useDb } from "../contexts/DbContext";
import { useAuth } from "../contexts/AuthContext";

const ProfileScreen = () => {
  const [update, setUpdate] = useState(false);

  const { getFromDb } = useDb();
  const { currentuser } = useAuth();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await getFromDb(currentuser.email);
        setUpdate(res.data() ? false : true);
      } catch (error) {
        console.error(error);
      }
    };
    getDetails();
  }, []);

  return (
    <div className="profile_screen_div ">
      (update&& <UserDetails />)
    </div>
  );
};

export default ProfileScreen;
