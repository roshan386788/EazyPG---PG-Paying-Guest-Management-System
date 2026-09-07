import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GrTransaction } from 'react-icons/gr';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const token = "eyJhbGciOiJSUzI1NiJ9.eyJyb2xlIjoiVEVOQU5UIiwidXNlcklkIjoxNSwic3ViIjoiYWppdEBnbWFpbC5jb20iLCJpYXQiOjE3NTQ2Mjc0ODAsImV4cCI6MTc1NDYzMTA4MH0.tMCLdxDuP-Or8wsKFzIcgNjqeCYbz1rZ0MnwL1DwelxrEGbwQKacVOqpukYYPBZoFDiw_YLd_lR2eEZLTi4HX5CY8Lo5IiJp4BBCM7hsYC3ECsU3dGmNSGdxxdSwSXG9AttyzVk0D_pqXkCbxEzI9LQCc4qMA9OhrOpjdSWulNAymGXsaRsbGJRHpU0X2P-tHRB05sjyAKEqoMhBKaJ3VRWwWVp1vH0EYqcwUDUDa7MXorsqefJSWu48mDtJu9z8zZeKWwln_muZFHA-25HJIiHfGV4LxxDyjkfaOqc9EmvJzooOHj_Lt_ALa05Kvbw9VxY92hYIk5qLQms0PKh7bA";
  const userId = "15";
  const userEmail = "ajit@gmail.com";
  const userRole = "TENANT";

  const headers = {
    Authorization: `Bearer ${token}`,
    "X-User-Email": userEmail,
    "X-User-Id": userId,
    "X-User-Role": userRole
  };

  useEffect(() => {
    if (!showHistory) return;

    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/payments/tenant", { headers });
        setPayments(response.data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [showHistory]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white p-6">
      {!showHistory ? (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <div
            onClick={() => setShowHistory(true)}
            className="bg-white rounded-full shadow-md p-6 cursor-pointer hover:scale-105 transition-transform"
          >
            <GrTransaction className="text-blue-500 text-5xl" />
          </div>
          <p className="mt-4 text-lg text-gray-700 font-medium">
            Tap to view your payment history
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <GrTransaction className="text-blue-600 text-3xl" />
            <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading payments...</p>
          ) : payments.length === 0 ? (
            <p className="text-center text-gray-500">No payments found.</p>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.paymentId}
                  className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-xl shadow-md px-6 py-4 flex justify-between items-center hover:shadow-lg transition-shadow"
                >
                  <div>
                    <p className="text-xl font-semibold text-blue-700">
                      ₹{payment.amount}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(payment.timestamp)}</p>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {payment.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
