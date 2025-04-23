/**
 * AdoptionCenterSkeleton (Alternate Version)
 * -----------------------------------------------------------
 * This component displays an alternative skeleton loader for the adoption center dashboard,
 * providing placeholder UI for main sections while data is loading.
 *
 * Main Features:
 *  - Uses Material-UI Skeletons and responsive Stack/Box layouts
 *  - Simulates dashboard sidebar, main content, and profile details
 *  - Disables body scrolling during the loading state for UX consistency
 *  - Can be used as a flexible loading screen for center-specific dashboard pages
 */

import React, { useEffect } from "react";
import { Skeleton, Box, Stack } from "@mui/material";

export default function AdoptionCenterSkeleton() {
    useEffect(() => {
        document.body.style.overflow = "hidden";
    }, []);

    return (
        <Box p={0} maxWidth={"2000px"} margin="0 auto">
            <Stack direction="row" spacing={4}>
                <Skeleton variant="rectangular" width="50%" height={640} />
                <Stack direction="column" width="50%">
                    <Stack spacing={1} width="50%" marginTop={3}>
                        <Stack spacing={1} width="80%">
                            <Skeleton variant="text" height={80} />
                        </Stack>
                        <Stack spacing={2} width="70%">
                            <Skeleton variant="text" height={30} />
                            <Skeleton variant="text" height={30} />
                            <Skeleton variant="text" height={30} />
                            <Skeleton variant="text" height={30} />
                            <Skeleton variant="text" height={30} />
                        </Stack>
                    </Stack>
                    <Stack spacing={2} width="25%" marginTop={3}>
                        <Skeleton variant="text" height={60} />
                    </Stack>
                    <Stack spacing={1} width="100%">
                        <Skeleton variant="text" height={30} />
                        <Skeleton variant="text" height={30} />
                        <Skeleton variant="text" height={30} />
                        <Skeleton variant="text" height={30} />
                    </Stack>

                    <Box mt={5}>
                        <Skeleton variant="rounded" width="100%" height={100} />
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}
