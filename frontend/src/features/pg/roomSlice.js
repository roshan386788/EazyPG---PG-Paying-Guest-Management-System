import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

// Add Room API
export const addRoom = createAsyncThunk(
  "room/addRoom",
  async ({ pgId, formData }, thunkAPI) => {
    try {
      console.log(formData);

      const res = await axiosInstance.post(`/api/pg/${pgId}/rooms`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ force it here
        },
      });
      console.log("res data : ", res);

      return { pgId, room: res.data }; // return pgId so we know where to add the room
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add room"
      );
    }
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ Update rooms array of PG in pgSlice without re-fetching
        const { pgId, room } = action.payload;
        const pgState = thunkPGUpdater(); // helper call
        if (pgState) {
          const pgIndex = pgState.pgList.findIndex((pg) => pg.id === pgId);
          if (pgIndex !== -1) {
            pgState.pgList[pgIndex].rooms.push(room);
          }
          if (pgState.pg && pgState.pg.id === pgId) {
            pgState.pg.rooms.push(room);
          }
        }
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add room";
      });
  },
});

// 🔹 Helper to update pgSlice state directly
const thunkPGUpdater = () => {
  // This will return the PG slice state from store
  // You will need to pass `extraReducers` a reference to PG slice via thunkAPI.getState
  return null; // We'll fix this in usage
};

export const { actions, reducer } = roomSlice;
export default reducer;
