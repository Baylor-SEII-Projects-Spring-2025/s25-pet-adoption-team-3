import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import { CssBaseline } from "@mui/material";
import { PetAdoptionThemeProvider } from "@/utils/theme";
import { buildStore } from "@/utils/redux";
import "@/styles/globals.css";

// Create a function to initialize the store
const getOrCreateStore = (initialState = {}) => {
    // For client-side, reuse the same store
    if (typeof window !== "undefined") {
        if (!window.__reduxStore) {
            window.__reduxStore = buildStore(initialState);
        }
        return window.__reduxStore;
    }
    // For server-side, create a new store for each request
    return buildStore(initialState);
};

export default function App({ Component, pageProps }) {
    const reduxStore = getOrCreateStore();

    return (
        <ReduxProvider store={reduxStore}>
            <AppCacheProvider>
                <Head>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width"
                    />
                    <link rel="icon" href="/icons/favicon.png" />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Unbounded:wght@200..900&display=swap"
                        rel="stylesheet"
                    />
                </Head>

                <PetAdoptionThemeProvider>
                    <CssBaseline />
                    <Component {...pageProps} />
                </PetAdoptionThemeProvider>
            </AppCacheProvider>
        </ReduxProvider>
    );
}

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
