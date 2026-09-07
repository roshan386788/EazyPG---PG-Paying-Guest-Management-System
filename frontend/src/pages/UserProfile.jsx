import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, editUser, deleteUser } from "../features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.user);

  const userId = localStorage.getItem("userId");
  const [editMode, setEditMode] = useState(false);
  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setEditData({
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const isEditable = user?.role === "TENANT" || user?.role === "OWNER";

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const submitEdit = () => {
    const updatedData = { ...editData };
    delete updatedData.token;
    delete updatedData.role;
    delete updatedData.userId;

    dispatch(editUser({ userId, userData: updatedData }))
      .unwrap()
      .then(() => {
        setMessage("Profile updated successfully.");
        setEditMode(false);
      })
      .catch(() => setMessage("Update failed"));
  };

  const submitPasswordChange = () => {
    const { password, confirmPassword } = passwordData;

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const confirmLogout = window.confirm(
      "Are you sure you want to change your password? You will be logged out of this website."
    );

    if (!confirmLogout) return;

    const updatedData = { ...editData, password };
    delete updatedData.token;
    delete updatedData.role;
    delete updatedData.userId;

    dispatch(editUser({ userId, userData: updatedData }))
      .unwrap()
      .then(() => {
        setMessage("Password updated successfully.");
        dispatch(logoutUser());
        alert("Password changed successfully. Please log in again.");
        navigate("/login", { replace: true });
      })
      .catch(() => setMessage("Password update failed."));
  };

  const handleDeleteUser = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    dispatch(deleteUser(userId))
      .unwrap()
      .then(() => {
        alert("Account deleted successfully.");
        dispatch(logoutUser());
        navigate("/login", { replace: true });
      })
      .catch(() => setMessage("Failed to delete account."));
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user found.</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <Link className="navbar-brand" to="/">
          EazyPG
        </Link>
        {!showPasswordCard && (
          <div className="ms-auto">
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <i className="fa-solid fa-user-pen"></i>
              Edit Profile
            </button>
          </div>
        )}
      </nav>

      {/* Main Body */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 70px)" }}
      >
        <div
          className="card shadow p-4 w-100"
          style={{ maxWidth: "500px", borderRadius: "16px" }}
        >
          {!showPasswordCard ? (
            <>
              <h3 className="mb-4 text-center">User Profile</h3>

              <div className="mb-3">
                <label className="form-label text-start w-100">Email:</label>
                <input
                  className="form-control"
                  name="email"
                  value={editData.email}
                  disabled
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-start w-100">
                  First Name:
                </label>
                <input
                  className="form-control"
                  name="firstName"
                  value={editData.firstName}
                  disabled={!editMode}
                  onChange={handleEditChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-start w-100">
                  Last Name:
                </label>
                <input
                  className="form-control"
                  name="lastName"
                  value={editData.lastName}
                  disabled={!editMode}
                  onChange={handleEditChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-start w-100">Phone:</label>
                <input
                  className="form-control"
                  name="phone"
                  value={editData.phone}
                  disabled={!editMode}
                  onChange={handleEditChange}
                />
              </div>

              {editMode && (
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <button
                      className="btn btn-success me-2"
                      onClick={submitEdit}
                    >
                      Save Changes
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditMode(false);
                        setMessage("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <button
                    className="btn btn-outline-warning w-100"
                    onClick={() => {
                      setShowPasswordCard(true);
                      setEditMode(false);
                      setMessage("");
                    }}
                  >
                    Update Password
                  </button>

                  {user?.role === "TENANT" && (
                    <button
                      className="btn btn-outline-danger w-100 mt-2"
                      onClick={() => {
                        const confirmed = window.confirm(
                          "Are you sure you want to promote this user to OWNER? You will be logged out and need to log in again."
                        );
                        if (!confirmed) return;

                        const updatedData = { ...editData, role: "OWNER" };

                        dispatch(editUser({ userId, userData: updatedData }))
                          .unwrap()
                          .then(() => {
                            alert(
                              "Successfully promoted to OWNER. Please log in again."
                            );
                            dispatch(logoutUser());
                            navigate("/login", { replace: true });
                          })
                          .catch(() => setMessage("Promotion failed."));
                      }}
                    >
                      Promote to OWNER
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <h3 className="mb-4 text-center text-danger">Change Password</h3>

              <div className="mb-3">
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-3">
                <input
                  className="form-control"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-danger"
                  onClick={submitPasswordChange}
                >
                  Change Password
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordCard(false);
                    setPasswordData({ password: "", confirmPassword: "" });
                    setMessage("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {message && (
            <div className="mt-3 text-success text-center">{message}</div>
          )}
          {error && <div className="mt-3 text-danger text-center">{error}</div>}
        </div>
      </div>

      {/* ✅ Floating Delete Button */}
      {!showPasswordCard && isEditable && (
        <button
          className="btn btn-danger position-fixed"
          style={{
            bottom: "20px",
            right: "20px",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "20px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          }}
          onClick={handleDeleteUser}
          title="Delete Account"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      )}
    </div>
  );
}
