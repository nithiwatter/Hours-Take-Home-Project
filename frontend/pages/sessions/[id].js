import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import io from "socket.io-client";

let socket;

export default function Sessions() {
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    const name = localStorage.getItem("name");
    socket = io(process.env.NEXT_PUBLIC_URL_API);
    socket.emit("join", { id, name });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      sessions
      <Link href="/">
        <a>Home</a>
      </Link>
    </div>
  );
}
