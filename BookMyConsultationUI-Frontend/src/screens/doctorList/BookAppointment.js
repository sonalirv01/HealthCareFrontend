import React, { useState } from "react";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  makeStyles,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { appointmentsAPI } from "../../util/fetch";

const useStyles = makeStyles(() => ({
  DialogContent: {
    padding: 20,
    maxHeight: "calc(90vh - 64px)",
  },
  dialogTitle: {
    backgroundColor: "purple",
    padding: 16,
    color: "white",
    fontSize: "1.2rem",
    width: "100%",
    margin: 0,
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  field: {
    marginTop: 16,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 4,
  },
  dialogPaper: {
    maxHeight: '90vh',
    overflowX: "hidden",
  },
}));

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const BookAppointment = ({ doctor, onClose, onBookingSuccess }) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [slotError, setSlotError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleBooking = async () => {
    setSlotError("");
    setSubmitError("");

    if (!timeSlot) {
      setSlotError("Select a time slot");
      return;
    }

    try {
      const appointmentDate = new Date(selectedDate);
      const [hour, minute] = timeSlot.split(/:| /);
      const adjustedHour = timeSlot.includes("PM") && hour !== "12" ? +hour + 12 : +hour;
      appointmentDate.setHours(adjustedHour);
      appointmentDate.setMinutes(+minute);
      appointmentDate.setSeconds(0);

      await appointmentsAPI.bookAppointment({
        doctorId: doctor._id,
        appointmentDate,
        notes: `${medicalHistory ? `History: ${medicalHistory}. ` : ""}${symptoms ? `Symptoms: ${symptoms}` : ""}`
      });

      alert("Appointment booked successfully!");
      if (onBookingSuccess) {
        onBookingSuccess();
      } else {
        window.dispatchEvent(new Event("appointment-booked"));
        onClose();
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Either the slot is already booked or not available.";
      setSubmitError(msg);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" classes={{ paper: classes.dialogPaper }}>
      <DialogTitle className={classes.dialogTitle} disableTypography>Book an Appointment</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          label="Doctor's Name"
          value={doctor.name}
          disabled
          className={classes.field}
        />

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            disablePast
            onChange={setSelectedDate}
            className={classes.field}
            format="yyyy/MM/dd"
          />
        </MuiPickersUtilsProvider>

        <FormControl className={classes.field}>
          <InputLabel>Time Slot</InputLabel>
          <Select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            {timeSlots.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot}
              </MenuItem>
            ))}
          </Select>
          {slotError && (
            <Typography className={classes.errorText}>
              {slotError}
            </Typography>
          )}
        </FormControl>

        <TextField
          label="Medical History (optional)"
          multiline
          rows={2}
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
          className={classes.field}
        />

        <TextField
          label="Symptoms (optional)"
          multiline
          rows={2}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className={classes.field}
        />

        {submitError && (
          <Typography className={classes.errorText}>
            {submitError}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
          onClick={handleBooking}
        >
          Confirm Booking
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointment;