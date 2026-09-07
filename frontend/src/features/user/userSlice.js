import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

// Get All Users (Admin)
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/api/v1/user/users");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch users"
      );
    }
  }
);

// Get Single User
export const getUser = createAsyncThunk(
  "user/getUser",
  async (userId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/api/v1/user/${userId}`);
      return res.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        window.location.href = "/";
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user"
      );
    }
  }
);

// ✅ Edit User
export const editUser = createAsyncThunk(
  "user/editUser",
  async ({ userId, userData }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/api/v1/user/${userId}`, userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update user"
      );
    }
  }
);

// ✅ Delete User
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/v1/user/${userId}`);
      return userId; // Returning deleted user ID
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete user"
      );
    }
  }
);

const initialState = {
  user: null,
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit User
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // Remove deleted user from users array
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
