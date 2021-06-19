import React from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import io from "socket.io-client";

const useStyles = makeStyles((_) => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

let socket;

export default function Sessions() {
  const [loading, setLoading] = React.useState(true);
  const [session, setSession] = React.useState({
    sessionId: "",
    participants: [],
  });
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    // useEffect should be called 2 times - when rehydrating (not ready) and when rehydrated (ready with query = id)
    // check if the router is ready and that the query parameter is passed appropriately
    if (!router.isReady) return;

    const name = localStorage.getItem("name");
    // redirected if name not in local storage
    if (!name) return handleBack();
    socket = io(process.env.NEXT_PUBLIC_URL_API);

    socket.on("joined", ({ session, name }) => {
      setSession(session);
      enqueueSnackbar(`${name} joined the session!`, { variant: "success" });
    });

    socket.on("left", ({ session, name }) => {
      setSession(session);
      enqueueSnackbar(`${name} left the session!`, { variant: "warning" });
    });

    socket.emit("join", { id, name }, (res) => {
      // if no session belongs to this id
      if (res.status === "failure") {
        // alert the user
        handleBack();
      } else {
        setSession(res.data.session);
        setLoading(false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [router.isReady]);

  const handleBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={classes.container}>
      <Typography
        variant="h3"
        align="center"
      >{`Session: ${session.sessionId}`}</Typography>
      <List>
        {session.participants.map((participant) => (
          <ListItem key={participant}>
            <ListItemAvatar>
              <Avatar>{participant === "" ? "Unknown" : participant[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText>{participant}</ListItemText>
          </ListItem>
        ))}
      </List>
      <Button onClick={handleBack} variant="contained" color="primary">
        Back to Home
      </Button>
    </div>
  );
}
