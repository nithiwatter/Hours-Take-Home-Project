import React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import Link from "next/link";
import { useRouter } from "next/router";
import io from "socket.io-client";

let socket;

export default function Sessions() {
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    const name = localStorage.getItem("name");
    socket = io(process.env.NEXT_PUBLIC_URL_API);
    socket.emit("join", { id, name }, (res) => {
      // if no session belongs to this id
      if (res.status === "failure") {
        // alert the user
        router.push(`/`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      sessions
      <Link href="/">
        <a>Home</a>
      </Link>
    </div>
  );
}
