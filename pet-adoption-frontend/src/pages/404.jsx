/**
 * Page Not Found (404) Page
 * -----------------------------------------------------------
 * This page is displayed when users navigate to an invalid or non-existent route.
 *
 * Main Features:
 *  - Renders the custom PageNotFoundComponent with a friendly 404 message
 *  - Provides a clear call-to-action for users to return to the homepage
 *  - Maintains the app's visual style and branding, even for error states
 */

import React from "react";
import PageNotFoundComponent from "@/components/404/404Component";

export default function PageNotFound() {
    return (
        <>
            <PageNotFoundComponent />
        </>
    );
}
