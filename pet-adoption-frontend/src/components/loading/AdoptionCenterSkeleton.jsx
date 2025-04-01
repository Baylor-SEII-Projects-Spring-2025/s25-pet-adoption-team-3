import React from "react";
import { Skeleton, Box, Stack } from "@mui/material";

export default function AdoptionCenterSkeleton() {
    return (
        <Box p={2}>
            <Stack spacing={2}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={150} />
                <Skeleton variant="text" width="40%" height={30} />
            </Stack>
        </Box>
    );
}
