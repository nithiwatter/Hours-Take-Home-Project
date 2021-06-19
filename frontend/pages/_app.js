import React from "react";
import { CssBaseline, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { SnackbarProvider } from "notistack";

export default function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <>
      <CssBaseline />
      <SnackbarProvider
        ref={notistackRef}
        action={(key) => (
          <IconButton onClick={onClickDismiss(key)}>
            <CloseIcon />
          </IconButton>
        )}
      >
        <Component {...pageProps} />
      </SnackbarProvider>
    </>
  );
}
