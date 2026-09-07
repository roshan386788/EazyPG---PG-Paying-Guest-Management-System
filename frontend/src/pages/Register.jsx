import "bootstrap/dist/css/bootstrap.min.css";
import "./Auth.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { registerUser } from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role, error, user, loading } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "TENANT",
  });

  // useEffect(() => {
  //   if (!loading && isAuthenticated && role) {
  //     if (role === "ADMIN") navigate("/admin");
  //     else if (role === "OWNER") navigate("/pg-owner");
  //     else if (role === "TENANT") navigate("/tenant");
  //   }
  // }, [loading, isAuthenticated, role, navigate]);

  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.firstName.trim())
      errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
    if (!formData.email) errors.email = "Email is required.";
    else if (!emailRegex.test(formData.email))
      errors.email = "Invalid email format.";
    if (!formData.phone) errors.phone = "Phone number is required.";
    else if (!phoneRegex.test(formData.phone))
      errors.phone = "Phone must be 10 digits.";
    if (!formData.password) errors.password = "Password is required.";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    if (!formData.confirmPassword)
      errors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      alert("Registration successful!");
      navigate("/TENANT");
    } else {
      alert(result.payload.error || "Registration failed.");
    }
  };

  return (
    <div className="eazy-auth-page">
      <div className="eazy-auth-row">
        <div className="eazy-auth-form-col">
          <div className="eazy-auth-form-inner">
            <div className="eazy-auth-brand">
              <span className="brand-icon">
                <Home size={16} strokeWidth={2.5} />
              </span>
              Eazy<span className="brand-accent">PG</span>
            </div>
            <h3 className="eazy-auth-heading">Create your account</h3>
            <p className="eazy-auth-subheading">Join EazyPG to book verified PGs in minutes.</p>
            <form onSubmit={handleSubmit}>
              {[
                { name: "firstName", label: "First Name" },
                { name: "lastName", label: "Last Name" },
                { name: "email", label: "Email", type: "email" },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "password", label: "Password", type: "password" },
                {
                  name: "confirmPassword",
                  label: "Confirm Password",
                  type: "password",
                },
              ].map(({ name, label, type = "text" }) => (
                <div className="mb-3" key={name}>
                  <input
                    type={type}
                    name={name}
                    className={`form-control ${
                      formErrors[name] ? "is-invalid" : ""
                    }`}
                    placeholder={label}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  />
                  {formErrors[name] && (
                    <div className="invalid-feedback">{formErrors[name]}</div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {/* {error && <div className="alert alert-danger text-center">{error}</div>} */}

            <div className="text-center my-2">OR</div>
            <div className="mb-3">
              <button className="btn btn-outline-danger w-100">
                <i className="fa-brands fa-google me-2"></i>
                Continue with Google
              </button>
            </div>

            <div className="text-center">
              <span>Already have an account?</span>
              <button className="btn btn-link" onClick={() => navigate("/")}>
                Login
              </button>
            </div>
          </div>
        </div>

        <div className="eazy-auth-side-col">
          <img
            src="https://visor.gumlet.io//public/assets/home/desktop/hero-img.png?compress=true&format=auto&quality=75&dpr=auto&h=480&w=522&ar=unset"
            alt="EazyPG"
            style={{
              maxHeight: "460px",
              width: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
