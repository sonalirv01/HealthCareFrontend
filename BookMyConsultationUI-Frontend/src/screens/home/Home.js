import React, { useState, useEffect, useCallback } from "react";
import Header from "../../common/header/Header";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabContainer from "../../common/tabContainer/TabContainer";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment";
import { doctorsAPI, appointmentsAPI } from "../../util/fetch";

const Home = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token"));
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const response = await doctorsAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);
  
  const fetchAppointments = useCallback(async () => {
    if (!isLoggedIn) {
      setAppointments([]);
      return;
    }
    
    setLoadingAppointments(true);
    try {
      const response = await appointmentsAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoadingAppointments(false);
    }
  }, [isLoggedIn]);

  // Fetch doctors when the component mounts
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Fetch appointments when logged in
  useEffect(() => {
    fetchAppointments();
  }, [isLoggedIn, fetchAppointments]);

  // Add event listeners for various events
  useEffect(() => {
    const handleLoginEvent = () => {
      setIsLoggedIn(true);
    };
    
    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setAppointments([]);
    };
    
    // Handle appointment booking
    const handleAppointmentBooked = () => {
      fetchAppointments();
    };
    
    // Handle rating submission
    const handleRatingSubmitted = () => {
      fetchDoctors();
      fetchAppointments();
    };
    
    window.addEventListener("login", handleLoginEvent);
    window.addEventListener("logout", handleLogoutEvent);
    window.addEventListener("appointment-booked", handleAppointmentBooked);
    window.addEventListener("rating-submitted", handleRatingSubmitted);
    
    return () => {
      window.removeEventListener("login", handleLoginEvent);
      window.removeEventListener("logout", handleLogoutEvent);
      window.removeEventListener("appointment-booked", handleAppointmentBooked);
      window.removeEventListener("rating-submitted", handleRatingSubmitted);
    };
  }, [fetchDoctors, fetchAppointments]);

  return (
    <div>
      <Header />
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth" 
      >
        <Tab label="DOCTORS" />
        <Tab label="APPOINTMENT" />
      </Tabs>

      {tabValue === 0 && (
        <TabContainer>
          <DoctorList 
            doctors={doctors} 
            loading={loadingDoctors} 
            onAppointmentBooked={() => {
              fetchAppointments();
            }}
          />
        </TabContainer>
      )}

      {tabValue === 1 && (
        <TabContainer>
          <Appointment 
            isLoggedIn={isLoggedIn} 
            appointments={appointments}
            loading={loadingAppointments}
          />
        </TabContainer>
      )}
    </div>
  );
};

export default Home;