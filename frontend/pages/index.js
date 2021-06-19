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
  const [sessions, setSessions] = React.useState([]);
  const classes = useStyles();

  const join = async () => {
    await getSessions();
    setOpen(true);
  };

  const getSessions = async () => {
    // session: { sessionId: String, participants: [] }
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_URL_API}/get-sessions`
    );
    const sessions = data.data.sessions;
    setSessions(sessions);
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
        sessions={sessions}
      />
    </>
  );
}

const SimpleDialog = (props) => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [selected, setSelected] = React.useState(-1);
  const { sessions, onClose, open } = props;

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
      // create a new session
      localStorage.setItem("name", name);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL_API}/create-session`
      );
      const sessionId = data.data.sessionId;
      onClose();
      router.push(`/sessions/${sessionId}`);
    } else {
      // join an existing session
      onClose();
      router.push(`/sessions/${sessions[selected].sessionId}`);
    }
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
              {sessions.map((session, idx) => (
                <ListItem
                  button
                  onClick={() => setSelected(idx)}
                  selected={selected === idx}
                  key={session.sessionId}
                >
                  <ListItemText>{session.sessionId}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Box>
          {selected !== -1 && (
            <Box ml={4}>
              <DialogContentText>Participants</DialogContentText>
              <List>
                {sessions[selected].participants.map((participant) => (
                  <ListItem key={participant}>
                    <ListItemText>{participant}</ListItemText>
                  </ListItem>
                ))}
              </List>
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
