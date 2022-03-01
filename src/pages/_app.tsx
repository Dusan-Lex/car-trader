import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../theme";
import createEmotionCache from "../createEmotionCache";
import { Nav } from "../components/Nav";
import { Box, Container } from "@mui/material";
import { SWRConfig } from "swr";
import axios from "axios";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Car Trader</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Nav />
        <SWRConfig
          value={{ fetcher: (url: string) => axios(url).then((r) => r.data) }}
        >
          <Container maxWidth={false}>
            <Box marginTop={2}>
              <Component {...pageProps} />
            </Box>
          </Container>
        </SWRConfig>
      </ThemeProvider>
    </CacheProvider>
  );
}
