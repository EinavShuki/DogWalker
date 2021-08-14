import { createSlice } from "@reduxjs/toolkit";
// import { users as USERS } from "../contexts/api";
import { useDb } from "../contexts/DbContext";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: null,
    users: [],
    loading: "idle",
    error: null,
  },
  reducers: {
    currentUserReceived: (state, action) => {
      state.currentUser = action.payload;
      state.loading = "idle";
    },
    usersReceived: (state, action) => {
      state.users = action.payload;
      state.loading = "idle";
    },
    userLoading: (state) => {
      state.loading = "pending";
    },
    userUpdateRecieved: (state) => {
      state.loading = "idle";
    },
    userError: (state, action) => {
      state.error = action.payload;
    },
    logoutUser: (state, action) => {
      state.currentUser = null;
    },
  },
});

export const {
  currentUserReceived,
  usersReceived,
  userLoading,
  userUpdateRecieved,
  userError,
  logoutUser,
} = usersSlice.actions;

export default usersSlice.reducer;

export const fetchCurrentUser = (email) => async (dispatch) => {
  // const { getFromDb } = useDb();
  dispatch(userLoading());
  try {
    console.log(email);
    // WILL BE API CALL
    // const res = await getFromDb(email);
    // console.log(res.data());
    dispatch(currentUserReceived(email));
  } catch (error) {
    dispatch(userError({ error: "some api error" }));
  }
};

export const fetchUsers = () => async (dispatch) => {
  dispatch(userLoading());
  try {
    // WILL BE API CALL
    // setTimeout(() => dispatch(usersReceived(USERS)), 2000);
  } catch (error) {
    dispatch(userError({ error: "some api error" }));
  }
};

export const UpdateUser = (email, phone) => async (dispatch) => {
  dispatch(userLoading());
  try {
    // WILL BE API CALL
    // setTimeout(() => dispatch(userUpdateRecieved(USERS)), 2000);
  } catch (error) {
    dispatch(userError({ error: "some api error" }));
  }
};
