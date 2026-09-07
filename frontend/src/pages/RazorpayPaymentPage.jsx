import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const RazorpayPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const booking = location.state?.booking; // Booking info from PGDetails
  const jwtToken = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (!booking) {
      alert("No booking data provided. Redirecting...");
      navigate(-1); // Go back if no booking info
    }
  }, [booking, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!booking) return;

    setMessage("⏳ Fetching rent and creating order...");

    try {
      // Fetch room rent via API
      const roomResponse = await axios.get(
        `http://localhost:8000/api/pgs/${booking.pgId}/rooms/${booking.roomId}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );

      const rent = roomResponse.data.rent;
      if (!rent) {
        setMessage("❌ Could not retrieve rent.");
        return;
      }

      // Create Razorpay order
      const orderResponse = await axios.post(
        "http://localhost:8000/api/payments/create-order",
        { bookingId: booking.id, amount: rent },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "X-User-Id": userId,
            "X-User-Email": userEmail,
            "X-User-Role": userRole,
            "Content-Type": "application/json",
          },
        }
      );

      const { key, orderId, amount, currency } = orderResponse.data;

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setMessage("❌ Razorpay SDK failed to load.");
        return;
      }

      const options = {
        key,
        amount,
        currency,
        name: "PG Stay Payment",
        description: "Rent Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            // Save payment info to backend
            await axios.post(
              "http://localhost:8000/api/payments",
              {
                bookingId: booking.id,
                amount: rent,
                paymentMethod: "ONLINE",
              },
              {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            setMessage("✅ Payment successful and saved.");
            alert("Payment successful!");
            navigate(-1); // Go back to PGDetails or previous page
          } catch (err) {
            console.error(err);
            setMessage("❌ Payment done but saving failed.");
            alert("Payment was done but saving failed. Contact support.");
            navigate(-1);
          }
        },
        prefill: {
          name: userEmail,
          email: userEmail,
          contact: "", // you can add contact if available
        },
        theme: {
          color: "#00bfff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during payment process.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Pay Your Rent via Razorpay</h2>
      <button onClick={handlePayment} style={{ padding: "10px 20px" }}>
        Pay Rent
      </button>
      <p>{message}</p>
    </div>
  );
};

export default RazorpayPaymentPage;
