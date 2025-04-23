import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../screens/home/Home";
import Login from "../screens/login/Login";
import Register from "../screens/register/Register";
import BookAppointment from "../screens/doctorList/BookAppointment";
import DoctorDetails from "../screens/doctorList/DoctorDetails";
import RateAppointment from "../screens/appointment/RateAppointment";

const Controller = () => {
  const baseUrl = "/api/v1/";

  return (
    <Router>
      <div className="main-container">
        <Route
          exact
          path="/"
          render={(props) => <Home {...props} baseUrl={baseUrl} />}
        />
        <Route
          path="/login"
          render={(props) => <Login {...props} baseUrl={baseUrl} />}
        />
        <Route
          path="/register"
          render={(props) => <Register {...props} baseUrl={baseUrl} />}
        />
        <Route
          path="/book-appointment/:doctorId"
          render={(props) => <BookAppointment {...props} baseUrl={baseUrl} />}
        />
        <Route
          path="/doctor-details/:doctorId"
          render={(props) => <DoctorDetails {...props} baseUrl={baseUrl} />}
        />
        <Route
          path="/rate-appointment/:appointmentId"
          render={(props) => <RateAppointment {...props} baseUrl={baseUrl} />}
        />
      </div>
    </Router>
  );
};

export default Controller;