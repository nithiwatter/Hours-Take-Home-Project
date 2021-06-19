import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Link from "next/link";
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
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    // useEffect should be called 2 times - when rehydrating (not ready) and when rehydrated (ready with query = id)
    // check if the router is ready and that the query parameter is passed appropriately
    if (!router.isReady) return;

    const name = localStorage.getItem("name");
    socket = io(process.env.NEXT_PUBLIC_URL_API);
    socket.emit("join", { id, name }, (res) => {
      // if no session belongs to this id
      if (res.status === "failure") {
        // alert the user
        router.push(`/`);
      } else {
        setSession(res.data.session);
        setLoading(false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [router.isReady]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={classes.container}>
      <Typography variant="h3">{`Session: ${session.sessionId}`}</Typography>
      <Link href="/">
        <a>Home</a>
      </Link>
    </div>
  );
}
