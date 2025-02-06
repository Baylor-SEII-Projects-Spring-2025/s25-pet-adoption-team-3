import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme } from "@mui/material";

// This file lets you modify the global theme of your project. Any changes here will affect all
// Material UI components throughout your website. Correspondingly, this is where you would set
// up your color palette, standard spacings, etc.
export const theme = createTheme({
    cssVariables: true,
    typography: {
        fontFamily: "Inter, sans-serif",
        fontSize: 14,
        body2: {
            fontSize: 14,
        },
    },
    shape: {
        borderRadius: 5,
    },
    palette: {
        primary: {
            main: "#8B80F9",
        },
        secondary: {
            main: "#6CD4FF",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    marginLeft: 4,
                    marginRight: 4,
                    marginTop: 4,
                    marginBottom: 4,
                    width: "100%",
                },
                containedPrimary: {
                    backgroundColor: "#8B80F9",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#9b91fa",
                    },
                },
                containedSecondary: {
                    backgroundColor: "#6CD4FF",
                    color: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#80d9ff",
                    },
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                fullWidth: true,
            },
            styleOverrides: {
                root: {
                    marginBottom: 8,
                },
            },
        },
    },
});

export const PetAdoptionThemeProvider = ({ children }) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

PetAdoptionThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
