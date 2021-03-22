import React, { useRef, useState } from "react";
import "./UserUpdate.css";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const UserUpdate = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { updatePassword, updateEmail, currentUser } = useAuth();
  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => setMessage("Updated successfully!"))
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {message === "" ? (
        <div className="update_div_box">
          <h2 className="update_tit">Update</h2>
          <form onSubmit={submitHandler} className="signup_form">
            <input
              defaultValue={currentUser.email}
              autoComplete="on"
              ref={emailRef}
              type="email"
              placeholder="Enter Email"
            />
            <input
              autoComplete="on"
              ref={passwordRef}
              type="password"
              placeholder="Live blank to keep current password"
            />
            <input
              autoComplete="on"
              ref={passwordConfirmRef}
              type="password"
              placeholder="Live blank to keep current password"
            />
            <small>{error}</small>
            <button disabled={loading} type="submit">
              Update
            </button>
          </form>
          <Link to="/">Cancel</Link>
        </div>
      ) : (
        <h2 className="msg">{message}</h2>
      )}
    </>
  );
};

export default UserUpdate;
