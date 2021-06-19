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
import { useRouter } from "next/router";
import axios from "axios";

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
  const [sessionIds, setSessionIds] = React.useState([]);
  const classes = useStyles();

  const join = async () => {
    await getSessions();
    setOpen(true);
  };

  const getSessions = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_URL_API}/get-sessions`
    );
    const sessionIds = data.data.sessionIds;
    setSessionIds(sessionIds);
  };

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
            <Button variant="contained" color="primary" onClick={join}>
              Join
            </Button>
          </Box>
        </div>
      </div>
      <SimpleDialog
        open={open}
        onClose={() => setOpen(false)}
        sessionIds={sessionIds}
      />
    </>
  );
}

const SimpleDialog = (props) => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [selected, setSelected] = React.useState(-1);
  const { sessionIds, onClose, open } = props;

  React.useEffect(() => {
    let initialName = localStorage.getItem("name");
    initialName = initialName !== null ? initialName : "";

    setName(initialName);
  }, []);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleJoin = async () => {
    if (selected === -1) {
      localStorage.setItem("name", name);
      await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/create-session`);
    }
    onClose();
    router.push(`/sessions/${sessionIds[selected]}`);
  };

  const handleClose = () => {
    setSelected(-1);
    onClose();
  };

  const handleClear = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/clear-sessions`);
    setSelected(-1);
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Join your session</DialogTitle>

      <DialogContent>
        <Box display="flex">
          <Box>
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
          </Box>
          {selected !== -1 && (
            <Box ml={4}>
              <DialogContentText>Participants</DialogContentText>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear} color="primary">
          Clear all sessions
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleJoin} color="primary">
          Create/Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};
