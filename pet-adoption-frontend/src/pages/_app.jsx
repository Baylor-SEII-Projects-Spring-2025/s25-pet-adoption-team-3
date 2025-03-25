import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import { CssBaseline } from "@mui/material";
import { PetAdoptionThemeProvider } from "@/utils/theme";
import { buildStore } from "@/utils/redux";
import "@/styles/globals.css";


// Initialize Redux
let initialState = {};
let reduxStore = buildStore(initialState);

export default function App({ Component, pageProps }) {
    return (
        <ReduxProvider store={reduxStore}>
            <AppCacheProvider>
                <Head>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width"
                    />
                    <link rel="icon" href="/icons/favicon.png" />
                </Head>

                <PetAdoptionThemeProvider>
                    {/* CssBaseline kickstarts an elegant, consistent, and simple baseline */}
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
