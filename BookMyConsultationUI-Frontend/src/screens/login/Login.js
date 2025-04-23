import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";
import { authAPI } from "../../util/fetch";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setAuthError("");
  
    if (!email) {
      setEmailError("Please fill out this field");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Enter valid Email");
      valid = false;
    }
  
    if (!password) {
      setPasswordError("Please fill out this field");
      valid = false;
    }
  
    if (!valid) return;
  
    try {
      const response = await authAPI.login({ emailId: email, password });
  
      sessionStorage.setItem("token", response.data.token);
      onClose();
      window.dispatchEvent(new Event("login"));
    } catch (err) {
      setAuthError(err.response?.data?.message || "Invalid login");
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
        <FormControl margin="normal" error={!!emailError} sx={{ width: "100%" }}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              setAuthError("");
            }}
          />
          <FormHelperText>{emailError}</FormHelperText>
        </FormControl>
  
        <FormControl margin="normal" error={!!passwordError} sx={{ width: "100%" }}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
              setAuthError("");
            }}
          />
          <FormHelperText>{passwordError}</FormHelperText>
        </FormControl>
  
        {authError && (
          <p style={{ color: "red", fontSize: "0.85rem" }}>{authError}</p>
        )}
  
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: "16px", marginBottom: "10px", width: "30%" }}
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        </div>
      </div>
    </div>
  );  
};

export default Login;