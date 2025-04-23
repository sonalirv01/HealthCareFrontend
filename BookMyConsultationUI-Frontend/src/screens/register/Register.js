import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";
import { authAPI } from "../../util/fetch";

const Register = ({ onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [regError, setRegError] = useState("");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateMobile = (mobile) =>
    /^[0-9]{10}$/.test(mobile);

  const handleRegister = async () => {
    let valid = true;
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setMobileError("");
    setRegError("");

    if (!firstName) {
      setFirstNameError("Please fill out this field");
      valid = false;
    }

    if (!lastName) {
      setLastNameError("Please fill out this field");
      valid = false;
    }

    if (!emailId) {
      setEmailError("Please fill out this field");
      valid = false;
    } else if (!validateEmail(emailId)) {
      setEmailError("Enter valid Email");
      valid = false;
    }

    if (!password) {
      setPasswordError("Please fill out this field");
      valid = false;
    }

    if (!mobile) {
      setMobileError("Please fill out this field");
      valid = false;
    } else if (!validateMobile(mobile)) {
      setMobileError("Enter valid mobile number");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await authAPI.register({
        firstName,
        lastName,
        emailId,
        password,
        mobile,
        role: "user",
      });

      sessionStorage.setItem("token", response.data.token);
      alert("Registration Successful");
      onClose();
      window.dispatchEvent(new Event("login"));
    } catch (err) {
      setRegError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%"
    }}>
      <div style={{ maxWidth: "300px", width: "100%" }}>
        <FormControl margin="normal" error={!!firstNameError} sx={{ width: "100%" }}>
          <InputLabel htmlFor="firstName">First Name*</InputLabel>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setFirstNameError("");
              setRegError("");
            }}
          />
          <FormHelperText>{firstNameError}</FormHelperText>
        </FormControl>

        <FormControl margin="normal" error={!!lastNameError} sx={{ width: "100%" }}>
          <InputLabel htmlFor="lastName">Last Name*</InputLabel>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setLastNameError("");
              setRegError("");
            }}
          />
          <FormHelperText>{lastNameError}</FormHelperText>
        </FormControl>

        <FormControl margin="normal" error={!!emailError} sx={{ width: "100%" }}>
          <InputLabel htmlFor="email">Email *</InputLabel>
          <Input
            id="email"
            value={emailId}
            onChange={(e) => {
              setEmailId(e.target.value);
              setEmailError("");
              setRegError("");
            }}
          />
          <FormHelperText>{emailError}</FormHelperText>
        </FormControl>

        <FormControl margin="normal" error={!!passwordError} sx={{ width: "100%" }}>
          <InputLabel htmlFor="password">Password *</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
              setRegError("");
            }}
          />
          <FormHelperText>{passwordError}</FormHelperText>
        </FormControl>

        <FormControl margin="normal" error={!!mobileError} sx={{ width: "100%" }}>
          <InputLabel htmlFor="mobile">Contact Number *</InputLabel>
          <Input
            id="mobile"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              setMobileError("");
              setRegError("");
            }}
          />
          <FormHelperText>{mobileError}</FormHelperText>
        </FormControl>

        {regError && (
          <p style={{ color: "red", fontSize: "0.85rem" }}>{regError}</p>
        )}

        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: "16px", marginBottom: "5px", width: "30%" }}
            onClick={handleRegister}
          >
            REGISTER
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;