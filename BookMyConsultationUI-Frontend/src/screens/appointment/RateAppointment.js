import React, { useState } from "react";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  makeStyles,
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import { appointmentsAPI } from "../../util/fetch";

const useStyles = makeStyles(() => ({
  dialogPaper: {
    maxHeight: '90vh',
    overflowX: 'hidden',
  },
  DialogContent: {
    padding: 20,
  },
  dialogTitle: {
    backgroundColor: "purple",
    padding: 16,
    color: "white",
    fontSize: "1.2rem",
    width: "100%",
    margin: 0,
  },
  field: {
    marginTop: 16,
    marginBottom: 20,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 4,
  },
  nameText: {
    fontWeight: 500,
  }
}));

const RateAppointment = ({ appointment, onClose }) => {
  const classes = useStyles();
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select the rating.");
      return;
    }

    try {
      await appointmentsAPI.rateAppointment({
        doctorId: appointment.doctorId._id || appointment.doctorId,
        appointmentId: appointment._id,
        rating: Number(rating),
        comments: comment,
      });

      alert("Thank you for your feedback!");

      window.dispatchEvent(new Event("rating-submitted"));

      onClose();
    } catch (err) {
      console.error("Error submitting rating", err);
      const msg = err.response?.data?.message || "Could not submit rating. Try again.";
      setError(msg);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth classes={{ paper: classes.dialogPaper }}>
      <DialogTitle className={classes.dialogTitle} disableTypography>
        Rate Appointment</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Typography variant="h6" className={classes.nameText}>
            {appointment.doctorId?.name || "N/A"}
          </Typography>
          <TextField
            label="Comment"
            multiline
            rows={3}
            className={classes.field}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Rating
            name="appointment-rating"
            value={Number(rating)}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          {error && (
            <Typography className={classes.errorText}>{error}</Typography>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
              onClick={handleSubmit}
            >
              Submit Rating
            </Button>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateAppointment;