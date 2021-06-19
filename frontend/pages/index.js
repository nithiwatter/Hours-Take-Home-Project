import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    "&.MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <div>
          <Typography variant="h3" align="center">
            Welcome to Home Page
          </Typography>
          <Typography variant="h5" align="center">
            To get started, click join
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Join
            </Button>
          </Box>
        </div>
      </div>
      <SimpleDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const SimpleDialog = (props) => {
  const classes = useStyles();

  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Join your session</DialogTitle>
      <TextField className={classes.input} />
    </Dialog>
  );
};
