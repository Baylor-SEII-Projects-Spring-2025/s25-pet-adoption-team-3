import React, { Suspense } from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export default function AdoptionCenterSkeleton() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Box
                sx={{
                    margin: "0 auto",
                    paddingTop: "80px",
                    maxWidth: "1500px",
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                }}
            >
                {/* Left sidebar */}
                <Stack spacing={2} sx={{ width: "200px", marginLeft: "50px" }}>
                    <Skeleton variant="text" width={100} height={40} />
                    <Skeleton variant="rectangular" width={80} height={20} />
                    <Skeleton variant="rectangular" width={80} height={20} />
                    <Skeleton variant="rectangular" width={80} height={20} />
                </Stack>

                {/* Divider */}
                <Box sx={{ borderLeft: "1px solid #000", height: "70vh" }} />

                {/* Main content */}
                <Stack spacing={4} sx={{ width: "100%", paddingX: 4 }}>
                    <Skeleton variant="text" width={200} height={40} />

                    {/* Messages section */}
                    <Box
                        sx={{
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                            width: "100%",
                        }}
                    >
                        <Skeleton variant="text" width={150} height={30} />
                        <Skeleton variant="rectangular" width="100%" height={100} />
                    </Box>

                    {/* Pets section */}
                    <Box
                        sx={{
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                            width: "100%",
                        }}
                    >
                        <Skeleton variant="text" width={150} height={30} />
                        <Skeleton variant="rectangular" width="100%" height={100} />
                    </Box>
                </Stack>
            </Box>
        </Suspense>
    );
}
