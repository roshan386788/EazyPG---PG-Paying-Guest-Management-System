import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const featchPGs = createAsyncThunk(
  "pg/pgs",
  async (params, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/api/pgs", { params });
      if (res.status === 200) {
        return res.data;
      } else {
        return thunkAPI.rejectWithValue("Failed to fetch PGs");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch PGs");
    }
  }
);

const initialState = {
  pgList: [],
  nextPageToken: null,
  loading: false,
  error: null,
};

const pgListSlice = createSlice({
  name: "pgList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(featchPGs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(featchPGs.fulfilled, (state, action) => {
        state.loading = false;
        state.pgList = [...state.pgList, ...action.payload.results];
        state.nextPageToken = action.payload.nextPageToken;
      })
      .addCase(featchPGs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pgListSlice.reducer;
