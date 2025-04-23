import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles(() => ({
  dialogPaper: {
    overflow: 'hidden',
    borderRadius: 4,
  },
  dialogTitle: {
    backgroundColor: "purple",
    padding: 16,
    color: "white",
    fontSize: "1.2rem",
    margin: 0,
    "& h2": {
      fontSize: "1.2rem",
      fontWeight: "normal",
      margin: 0,
    }
  },
  dialogContent: {
    padding: 20,
  },
  infoText: {
    marginTop: 12,
  },
  nameText: {
    fontWeight: 600,
  },
}));

const DoctorDetails = ({ doctor, onClose }) => {
  const classes = useStyles();
  
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        Doctor Details
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="h6" className={classes.nameText}>{doctor.name}</Typography>

        <>
          <Typography className={classes.infoText}>
            <strong>Total Experience:</strong> {doctor.experience} years
          </Typography>
          <Typography className={classes.infoText}>
            <strong>Speciality:</strong> {doctor.specialization}
          </Typography>
          <Typography className={classes.infoText}>
            <strong>Date of Birth:</strong>{" "}
            {doctor?.dob
              ? new Date(doctor.dob).toLocaleDateString()
              : "N/A"}
          </Typography>
          <Typography className={classes.infoText}>
            <strong>City:</strong> {doctor.addressId?.city || "N/A"}
          </Typography>
          <Typography className={classes.infoText}>
            <strong>Email:</strong> {doctor?.email || "N/A"}
          </Typography>
          <Typography className={classes.infoText}>
            <strong>Mobile:</strong> {doctor?.mobile || "N/A"}
          </Typography>
          <Typography className={classes.infoText}>
            <strong>Rating:</strong>
            <Rating
              value={Number(doctor.rating)}
              readOnly
              precision={0.1}
            />
          </Typography>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetails;