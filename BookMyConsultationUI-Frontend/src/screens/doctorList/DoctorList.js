import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from "@material-ui/core/styles";
import BookAppointment from "./BookAppointment";
import DoctorDetails from "./DoctorDetails";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "40%",
    margin: 10,
  },
  greenButton: {
    backgroundColor: "green",
    color: "white",
    width: "40%",
    margin: 10,
  },
  buttonContainer: {
    display: "flex", 
    justifyContent: "space-between", 
    flexWrap: "wrap", 
    marginTop: 10,
  },
  actionButton: {
    flexGrow: 1,
    margin: '5px',
    whiteSpace: "normal",
    height: "auto",
    minHeight: "36px",
    padding: '8px 16px',
  }
}));

const DoctorList = ({ doctors, loading, onAppointmentBooked }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [doctorsList, setDoctorsList] = useState(doctors);

  // Set initial state for doctors list
  useEffect(() => {
    setDoctorsList(doctors);
    
    // Listen for rating updates
    const handleRatingUpdate = () => {
      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    };
    
    window.addEventListener("rating-submitted", handleRatingUpdate);
    return () => window.removeEventListener("rating-submitted", handleRatingUpdate);
  }, [doctors, onAppointmentBooked]);

  const filteredDoctors = specialization
    ? doctorsList.filter((doc) => doc.specialization === specialization)
    : doctorsList;

  const specializations = [...new Set(doctorsList.map((doc) => doc.specialization))];

  const handleAppointmentBooked = () => {
    setOpenBookModal(false);
    if (onAppointmentBooked) {
      onAppointmentBooked();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <FormControl style={{ minWidth: 200, marginBottom: 20 }}>
        <Typography variant="body1" align="left" style={{ marginBottom: 8 }}>
          Select Speciality:
        </Typography>
        <Select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          displayEmpty
          style={{ textAlign: "left", minHeight: 50, backgroundColor: "#e6e4e1" }}
          renderValue={(selected) => {
            if (selected === "") {
              return <span></span>;
            }
            return selected;
          }}
        >
          {specializations.map((spec) => (
            <MenuItem key={spec} value={spec}>
              {spec}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'left', marginTop: 20 }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredDoctors.map((doc) => (
            <Grid item xs={12} key={doc._id}>
              <Card style={{ width: isMobile ? "100%" : "40%", margin: "0 auto" }}>
                <CardContent>
                  <div className={classes.doctorInfo}>
                    <Typography variant="h5" align="left">{doc.name}</Typography>
                    <Typography variant="body2" color="textSecondary" align="left" style={{ fontSize: 20 }}>
                      {doc.specialization}
                    </Typography>
                    <Typography variant="body2" align="left" style={{ marginBottom: 16, fontSize: 20 }}>
                      Rating:
                      <Rating
                        value={Number(doc.rating)}
                        readOnly
                        precision={0.1}
                      />
                    </Typography>
                  </div>

                  <div className={classes.buttonContainer} style={{ flexDirection: isMobile ? 'column' : 'row' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.actionButton}
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setOpenBookModal(true);
                      }}
                    >
                      Book Appointment
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.actionButton}
                      style={{
                        backgroundColor: "green",
                        color: "white",
                      }}
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setOpenDetailsModal(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal overlays */}
      {openBookModal && (
        <BookAppointment
          doctor={selectedDoctor}
          onClose={() => setOpenBookModal(false)}
          onBookingSuccess={handleAppointmentBooked}
        />
      )}
      {openDetailsModal && (
        <DoctorDetails
          doctor={selectedDoctor}
          onClose={() => setOpenDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default DoctorList;