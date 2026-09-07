// features/booking/bookingSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios";

// Create Booking
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, thunkAPI) => {
    try {
      // Get tenantId from localStorage or wherever you store user info
      const tenantId = localStorage.getItem("userId"); // Adjust this key as per your app

      if (!tenantId) {
        return thunkAPI.rejectWithValue("User not logged in");
      }

      // Send POST request with required header
      const res = await axiosInstance.post("/api/bookings", bookingData, {
        headers: {
          "X-User-Id": tenantId,
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create booking"
      );
    }
  }
);

// Cancel Booking
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/bookings/${bookingId}`);
      return bookingId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to cancel booking"
      );
    }
  }
);

// Get Tenant Bookings
export const getTenantBookings = createAsyncThunk(
  "booking/getTenantBookings",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/api/bookings");
      return res.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch bookings"
      );
    }
  }
);

const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Tenant Bookings
      .addCase(getTenantBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTenantBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getTenantBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
