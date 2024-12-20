import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [], // List of online users
  socketConnection: null, // Store socket connection object
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080", // Default base URL
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user details
    setUser: (state, action) => {
      const { _id = "", name = "", email = "", profile_pic = "" } = action.payload || {};
      state._id = _id;
      state.name = name;
      state.email = email;
      state.profile_pic = profile_pic;
    },

    // Set authentication token
    setToken: (state, action) => {
      state.token = action.payload || ""; // Ensure token defaults to an empty string if undefined
    },

    // Log out user and clear state
    logout: (state) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.token = "";
      state.socketConnection = null;
      state.onlineUser = [];
    },

    // Update the list of online users
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload || []; // Ensure it defaults to an empty array
    },

    // Set socket connection
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload || null; // Ensure it defaults to null
    },

    // Dynamically update the base URL
    setBaseURL: (state, action) => {
      state.baseURL = action.payload || state.baseURL; // Retain existing base URL if undefined
    },
  },
});

// Export actions
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection, setBaseURL } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
