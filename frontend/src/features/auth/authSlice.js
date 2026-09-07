import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
import {jwtDecode} from "jwt-decode";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (CredentialsContainer, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/api/auth/login", CredentialsContainer);
      
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        const decoded = jwtDecode(res.data.token);
        console.log("Decoded token:", decoded);
        
        localStorage.setItem("role", decoded.role);
        localStorage.setItem("userId",decoded.userId);
        localStorage.setItem("email",decoded.sub)
        return res.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/api/auth/register", userData);
      console.log("Register response:", res);
      if (res.status === 201) {
        localStorage.setItem("token", res.data.token);
        const decoded = jwtDecode(res.data.token);
        localStorage.setItem("role", decoded.role);
        return res.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Register failed");
    }
  }
);
const token = localStorage.getItem("token");
let decodedUser = null;
let role = null;
let userId = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    decodedUser = { email: decoded.sub };
    role = decoded.role;
    userId = decoded.userId;
  } catch (e) {
    console.error("Invalid token", e);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
}

const initialState = {
  user: decodedUser,
  role: role,
  isAuthenticated: !!token,
  loading: false,
  error: null,
  userId: userId,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      state.user = null;
      state.role = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.token) {
          const decoded = jwtDecode(action.payload.token);
          state.user = { email: decoded.sub };
          state.role = decoded.role;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.role = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Register action payload:", action.payload?.token);
        if (action.payload && action.payload.token) {
          const decoded = jwtDecode(action.payload.token);
          state.user = { email: decoded.sub };
          state.role = decoded.role;
          state.userId = decoded.userId;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.role = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
