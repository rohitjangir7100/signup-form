import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./styles.css";

const countries = {
  India: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Lucknow"],
  Canada: ["Toronto", "Vancouver", "Montreal"],
  Australia: ["Sydney", "Melbourne", "Brisbane"],
  Germany: ["Berlin", "Munich", "Frankfurt"],
  France: ["Paris", "Lyon", "Marseille"],
  Japan: ["Tokyo", "Osaka", "Kyoto"],
  Brazil: ["Sao Paulo", "Rio de Janeiro", "Salvador"],
  USA: ["New York", "Los Angeles", "Chicago"],
  UK: ["London", "Manchester", "Birmingham"],
};

const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const panValidator = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const phoneCodeValidator = /^\+\d{1,4}$/;
const phoneNumberValidator = /^\d{7,12}$/;

function Form() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    showPassword: false,
    phoneCode: "",
    phoneNumber: "",
    country: "",
    city: "",
    pan: "",
    aadhar: "",
  });

  const [errors, setErrors] = useState({});

  const validators = {
    firstName: (value) => (!value.trim() ? "*First Name is required" : ""),
    lastName: (value) => (!value.trim() ? "*Last Name is required" : ""),
    username: (value) => (!value.trim() ? "*Username is required" : ""),
    email: (value) => {
      if (!value.trim()) return "*Email is required";
      if (!emailValidator.test(value)) return "*Invalid email address";
      return "";
    },
    password: (value) => {
      if (!value) return "*Password is required";
      if (value.length < 6) return "*Password must be at least 6 characters";
      return "";
    },
    phoneCode: (value) => {
      if (!value.trim()) return "*Phone code is required";
      if (!phoneCodeValidator.test(value)) return "*Phone code must be like +91 or +1";
      return "";
    },
    phoneNumber: (value) => {
      if (!value.trim()) return "*Phone number is required";
      if (!phoneNumberValidator.test(value)) return "*Phone number must be 7-12 digits";
      return "";
    },
    country: (value) => (!value ? "*Country is required" : ""),
    city: (value) => (!value ? "*City is required" : ""),
    pan: (value) => {
      if (!value.trim()) return "*PAN number is required";
      if (!panValidator.test(value)) return "*Invalid PAN format (e.g., ABCDE1234F)";
      return "";
    },
    aadhar: (value) => {
      if (!value.trim()) return "*Aadhar number is required";
      if (!/^\d{12}$/.test(value)) return "*Aadhar must be a 12-digit number";
      return "";
    },
  };

  const validateField = (name, value) => {
    const error = validators[name] ? validators[name](value) : "";
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const validateForm = () => {
    const newErrors = {};
    for (const field in validators) {
      const error = validators[field](formData[field]);
      if (error) newErrors[field] = error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    validateField(name, val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate("/success", { state: formData });
    }
  };

  const isFormValid = Object.values(errors).every((error) => error === "") && Object.values(formData).every((val) => val !== "");

  return (
    <div className="container">
      <h2>SignUp Form</h2>
      <form onSubmit={handleSubmit} noValidate>
        {[
          { label: "First Name", name: "firstName" },
          { label: "Last Name", name: "lastName" },
          { label: "Username", name: "username" },
          { label: "Email", name: "email", type: "email" },
          { label: "PAN Number", name: "pan" },
          { label: "Aadhar Number", name: "aadhar" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onBlur={(e) => validateField(name, e.target.value)}
            />
            {errors[name] && <div className="error">{errors[name]}</div>}
          </div>
        ))}

        <div>
          <label>Password</label>
          <div className="row">
            <input
              type={formData.showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={(e) => validateField("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
            >
              {formData.showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <div>
          <label>Phone Number</label>
          <div className="row">
            <input
              type="text"
              name="phoneCode"
              placeholder="Code"
              value={formData.phoneCode}
              onChange={handleChange}
              onBlur={(e) => validateField("phoneCode", e.target.value)}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={(e) => validateField("phoneNumber", e.target.value)}
            />
          </div>
          {(errors.phoneCode || errors.phoneNumber) && (
            <div className="error">{errors.phoneCode || errors.phoneNumber}</div>
          )}
        </div>

        <div>
          <label>Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            onBlur={(e) => validateField("country", e.target.value)}
          >
            <option value="">-- Select Country --</option>
            {Object.keys(countries).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && <div className="error">{errors.country}</div>}
        </div>

        <div>
          <label>City</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={(e) => validateField("city", e.target.value)}
            disabled={!formData.country}
          >
            <option value="">-- Select City --</option>
            {(countries[formData.country] || []).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && <div className="error">{errors.city}</div>}
        </div>

        <button type="submit" disabled={!isFormValid}>
          Submit
        </button>
      </form>
    </div>
  );
}

function Success() {
  const location = useLocation();
  const data = location.state;

  return (
    <div className="success-container">
      <h2>Form Submission Successful 🎉</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
