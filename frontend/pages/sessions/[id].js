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
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
// import ScrollToBottom, {
//   useScrollToBottom,
//   useScrollToEnd,
//   useSticky,
// } from "react-scroll-to-bottom";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import io from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    height: "60vh",
    width: "40vw",
  },
  chatMessages: {
    overflowY: "auto",
  },
  chatMessage: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  chatMessageAuthor: {
    fontWeight: 700,
  },
}));

let socket;

export default function Sessions() {
  const [loading, setLoading] = React.useState(true);
  const [session, setSession] = React.useState({
    sessionId: "",
    participants: [],
  });
  const [name, setName] = React.useState("");
  const [messages, setMessages] = React.useState([
    { text: "Test message", author: "Hello world", id: "abc" },
    { text: "Test message 2", author: "Hello world 2", id: "def" },
  ]);
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

    socket.on("sent", ({ author, text, id }) => {
      setMessages((messages) => [...messages, { author, text, id }]);
    });

    socket.emit("join", { id, name }, (res) => {
      // if no session belongs to this id
      if (res.status === "failure") {
        // alert the user
        handleBack();
      } else {
        setSession(res.data.session);
        setName(name);
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

      <Box display="flex" pt={2} pb={2}>
        <Box mr={4}>
          <List>
            {session.participants.map((participant) => (
              <ListItem key={participant}>
                <ListItemAvatar>
                  <Avatar>
                    {participant === "" ? "Unknown" : participant[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>{participant}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>

        <Chat name={name} messages={messages} />
      </Box>

      <Button onClick={handleBack} variant="contained" color="primary">
        Back to Home
      </Button>
    </div>
  );
}

function Chat(props) {
  const [message, setMessage] = React.useState("");
  const classes = useStyles();
  const { name, messages } = props;

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    // detect enter key
    if (event.keyCode === 13) {
      event.preventDefault();
      socket.emit("send", { message, name });
      setMessage("");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      className={classes.chatContainer}
    >
      <Box flexGrow={1} className={classes.chatMessages}>
        <Content name={name} messages={messages} />
      </Box>

      <Box>
        <TextField
          label="Message"
          variant="filled"
          fullWidth
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </Box>
    </Box>
  );
}

function Content(props) {
  const messagesEndRef = React.useRef(null);
  const classes = useStyles();
  const { name, messages } = props;

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  return (
    <>
      {messages.map((message) => (
        <Box
          display="flex"
          flexDirection={name === message.author ? "row-reverse" : "row"}
          key={message.id}
        >
          <div className={classes.chatMessage}>
            <div className={classes.chatMessageAuthor}>{message.author}</div>
            <div>{message.text}</div>
          </div>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}
