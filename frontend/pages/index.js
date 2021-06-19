import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
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
          <Box display="flex" justifyContent="center" m={1}>
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
  const sessionIds = ["abc", "def", "ghi"];
  const [name, setName] = React.useState("");
  const [selected, setSelected] = React.useState(-1);
  const { onClose, open } = props;

  React.useEffect(() => {
    var initialName = localStorage.getItem("name");
    initialName = initialName !== null ? initialName : "";
    setName(initialName);
  }, []);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleClose = (saveName) => {
    if (saveName) {
      localStorage.setItem("name", name);
    }
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Join your session</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can either create a new session or join existing one
        </DialogContentText>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={handleChange}
        />
        <List>
          <ListItem
            button
            onClick={() => setSelected(-1)}
            selected={selected === -1}
          >
            <ListItemText>Create a session</ListItemText>
          </ListItem>
          {sessionIds.map((sessionId, idx) => (
            <ListItem
              button
              onClick={() => setSelected(idx)}
              selected={selected === idx}
              key={sessionId}
            >
              <ListItemText>{sessionId}</ListItemText>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleClose(true)} color="primary">
          Create/Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};
