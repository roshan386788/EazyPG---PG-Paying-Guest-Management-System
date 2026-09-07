import "bootstrap/dist/css/bootstrap.min.css";
import "./Auth.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { loginUser } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, role, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("owner12@gmail.com");
  const [password, setPassword] = useState("123456");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "ADMIN") navigate("/admin");
      else if (role === "OWNER") navigate("/pg-owner");
      else if (role === "TENANT") navigate("/tenant");
    }
  }, [isAuthenticated, role, navigate]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      console.log("Login result:", resultAction);

      if (!loginUser.fulfilled.match(resultAction)) {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
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
            <h3 className="eazy-auth-heading">Welcome back</h3>
            <p className="eazy-auth-subheading">Log in to continue finding your next PG.</p>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center my-2">OR</div>
            <div className="mb-3">
              <button className="btn btn-outline-danger w-100">
                <i className="fa-brands fa-google me-2"></i>
                Continue with Google
              </button>
            </div>

            <div className="text-center">
              <span>Don't have an account?</span>
              <button
                className="btn btn-link"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {/* Right Image */}
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

export default Login;
