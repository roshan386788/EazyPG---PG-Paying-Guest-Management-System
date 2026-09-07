import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

// Add PG
export const addPg = createAsyncThunk("pg/addPg", async (pgData, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/api/pgs", pgData);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Add PG failed");
  }
});

// Get All PGs
export const getAllPgs = createAsyncThunk(
  "pg/getAllPgs",
  async (city, thunkAPI) => {
    try {
      let url = "/api/pgs";
      if (city) {
        url += `?city=${encodeURIComponent(city)}`;
      }
      const res = await axiosInstance.get(url);
      return res.data.content || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch PGs"
      );
    }
  }
);

// Get PGs by Owner
export const getPgsByOwner = createAsyncThunk(
  "pg/getPgsByOwner",
  async (ownerId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/api/pgs/owner/${ownerId}`);
      console.log("resdata:", JSON.stringify(res.data[0]));

      return res.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch owner's PGs"
      );
    }
  }
);

// Delete PG
export const deletePg = createAsyncThunk(
  "pg/deletePg",
  async (pgId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/api/pgs/${pgId}`);
      if (res.status === 204) {
        return pgId;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete PG"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  pg: null,
  pgList: [],
};

const pgSlice = createSlice({
  name: "pg",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPg.fulfilled, (state, action) => {
        state.loading = false;
        state.pg = action.payload;
      })
      .addCase(addPg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add PG";
      })

      .addCase(getAllPgs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPgs.fulfilled, (state, action) => {
        state.loading = false;
        state.pgList = action.payload;
      })
      .addCase(getAllPgs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch PGs";
      })

      .addCase(getPgsByOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPgsByOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.pgList = action.payload;
      })
      .addCase(getPgsByOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch owner's PGs";
      })

      .addCase(deletePg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePg.fulfilled, (state, action) => {
        state.loading = false;
        state.pgList = state.pgList.filter((pg) => pg.id !== action.payload);
      })
      .addCase(deletePg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete PG";
      });
  },
});

export const { actions, reducer } = pgSlice;
export default reducer;
