import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/logo.jpeg";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Tabs,
  Tab,
} from "@material-ui/core";
import Login from "../../screens/login/Login";
import Register from "../../screens/register/Register";
import TabContainer from "../tabContainer/TabContainer";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 = Login, 1 = Register

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("logout"));
  };

  useEffect(() => {
    const handleLoginEvent = () => {
      setIsLoggedIn(true);
    };
    window.addEventListener("login", handleLoginEvent);
    return () => window.removeEventListener("login", handleLoginEvent);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="header">
      <img src={logo} alt="Logo" className="logo" />

      {isLoggedIn ? (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleLogout}
        >
          Logout
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={openModal}
        >
          Login
        </Button>
      )}

      <Dialog
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="auth-dialog"
        maxWidth="xs"
        fullWidth={false}
        PaperProps={{
          style: { 
            borderRadius: "10px",
            width: "360px",
            maxWidth: "90vw"
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)'
          }
        }}
      >
        <DialogTitle
          style={{
            backgroundColor: "#800080",
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            padding: "12px 0",
          }}
        >
          Authentication
        </DialogTitle>

        <DialogContent>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="primary"
            variant="fullWidth"
            centered
          >
            <Tab label="Login" style={{ minWidth: "45%" }} />
            <Tab label="Register" style={{ minWidth: "45%" }} />
          </Tabs>

          <TabContainer>
            {tabValue === 0 ? (
              <Login onClose={closeModal} />
            ) : (
              <Register onClose={closeModal} />
            )}
          </TabContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;