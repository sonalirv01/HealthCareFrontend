import React, { useState } from "react";
import { Card, CardContent, Typography, Grid, Button, CircularProgress } from "@material-ui/core";
import RateAppointment from "./RateAppointment";

const Appointment = ({ isLoggedIn, appointments, loading }) => {
  const [selectedAppt, setSelectedAppt] = useState(null);

  const handleRateClick = (appt) => {
    setSelectedAppt(appt);
  };

  // Extract prior medical history from notes if available
  const extractMedicalHistory = (notes) => {
    if (!notes) return "None";
    const historyMatch = notes.match(/History: (.*?)(?=\. Symptoms:|$)/);
    return historyMatch ? historyMatch[1] : "None";
  };

  // Extract symptoms from notes if available
  const extractSymptoms = (notes) => {
    if (!notes) return "None specified";
    const symptomsMatch = notes.match(/Symptoms: (.*?)(?=\.|$)/);
    return symptomsMatch ? symptomsMatch[1] : "None specified";
  };

  if (!isLoggedIn) {
    return (
      <Typography style={{ marginTop: 20 }} variant="body1" align="left">
        Please log in to view your appointments.
      </Typography>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom align="left">
        Your Appointments:
      </Typography>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'left', marginTop: 20 }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3}>
          {appointments.length === 0 ? (
            <Typography variant="body2" style={{ marginLeft: 16 }} align="left">
              You have no appointments booked yet.
            </Typography>
          ) : (
            appointments.map((appt) => (
              <Grid item xs={12} key={appt._id}>
                <Card>
                  <CardContent style={{ textAlign: "left" }}>
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 700, fontSize: 20 }}
                      align="left"
                    >
                      {appt.doctorId?.name || "N/A"}
                    </Typography>
                    <Typography variant="body1" align="left">
                      Date: {new Date(appt.appointmentDate).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" align="left">
                      Symptoms: {extractSymptoms(appt.notes)}
                    </Typography>
                    <Typography variant="body2" align="left">
                      Prior-Medical-History: {extractMedicalHistory(appt.notes)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginTop: 12, fontWeight: 700 }}
                      onClick={() => handleRateClick(appt)}
                    >
                      Rate Appointment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Render modal if selected */}
      {selectedAppt && (
        <RateAppointment
          appointment={selectedAppt}
          onClose={() => setSelectedAppt(null)}
        />
      )}
    </div>
  );
};

export default Appointment;