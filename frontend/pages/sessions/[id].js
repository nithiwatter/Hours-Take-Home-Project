import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import io from "socket.io-client";

let socket;

export default function Sessions() {
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_URL_API);
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
