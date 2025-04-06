import React, { useEffect } from "react";
import { Skeleton, Box, Stack, Avatar } from "@mui/material";
import styles from "@/styles/ProfileDashboardComponent.module.css";

export default function ProfileSkeleton() {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <Box sx={{ width: "100vw", minHeight: "100vh", overflowX: "hidden", pt: 10 }}>
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                sx={{ width: "100%", px: { xs: 2, md: 6 } }}
            >
                {/* Left nav */}
                <Box className={styles.profileLeftSection}>
                    <div className={styles.profileNavbarLeft}>
                        <Skeleton variant="text" width={100} height={40} />
                        <Skeleton variant="rectangular" width={80} height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" width={80} height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="rectangular" width={80} height={20} />
                    </div>
                </Box>

                <Box
                    className={styles.divider}
                    display={{ xs: "none", md: "block" }}
                    sx={{ minHeight: "100%" }}
                />

                {/* Right section */}
                <Box className={styles.profileRightSection} sx={{ flex: 1 }}>
                    <Stack className={styles.profileNavbarRight} spacing={4}>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            className={styles.dashboardHeader}
                            spacing={4}
                        >
                            <Stack className={styles.dashboardWrapper} spacing={2} sx={{ flex: 1 }}>
                                <Stack
                                    direction="row"
                                    className={styles.dashboardWrapperHeader}
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Skeleton variant="circular">
                                        <Avatar sx={{ width: 100, height: 100 }} />
                                    </Skeleton>
                                    <Skeleton variant="text" width={200} height={40} />
                                </Stack>

                                <Stack className={styles.dashboardContent} spacing={2}>
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={2}
                                        className={styles.dashboardContentTop}
                                    >
                                        <Skeleton variant="rectangular" width="100%" height={56} />
                                        <Skeleton variant="rectangular" width="100%" height={56} />
                                    </Stack>
                                    <Skeleton variant="rectangular" width="100%" height={56} />
                                    <Skeleton variant="rectangular" width="100%" height={56} />
                                </Stack>
                            </Stack>

                            <Stack className={styles.profileMessaging} spacing={2} sx={{ minWidth: 250 }}>
                                <Skeleton variant="text" width={120} height={30} />
                                <Skeleton variant="rectangular" width="100%" height={100} />
                            </Stack>
                        </Stack>

                        <Stack className={styles.profileMatches} spacing={2}>
                            <Skeleton variant="text" width={120} height={30} />
                            <Skeleton variant="rectangular" width="100%" height={100} />
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}
