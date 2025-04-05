import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import styles from "@/styles/ProfileDashboardComponent.module.css";

export default function ProfileSkeleton() {
    return (
        <div className={styles.container}>
            <div className={styles.profileLeftSection}>
                <div className={styles.profileNavbarLeft}>
                    <Skeleton variant="text" width={100} height={40} />
                    <Skeleton variant="rectangular" width={80} height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={20} />
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.profileRightSection}>
                <div className={styles.profileNavbarRight}>
                    <div className={styles.dashboardHeader}>
                        <div className={styles.dashboard}>
                            <div className={styles.dashboardHeaderContent}>
                                <div className={styles.dashboardWrapper}>
                                    <div className={styles.dashboardWrapperHeader}>
                                        <Skeleton variant="circular">
                                            <Avatar sx={{ width: 100, height: 100 }} />
                                        </Skeleton>
                                        <Skeleton variant="text" width={200} height={40} />
                                    </div>

                                    <div className={styles.dashboardContent}>
                                        <div className={styles.dashboardContentTop}>
                                            <Skeleton variant="rectangular" width="45%" height={56} />
                                            <Skeleton variant="rectangular" width="45%" height={56} />
                                        </div>
                                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ my: 2 }} />
                                        <Skeleton variant="rectangular" width="100%" height={56} />
                                    </div>
                                </div>

                                <div className={styles.profileMessaging}>
                                    <Skeleton variant="text" width={120} height={30} />
                                    <Skeleton variant="rectangular" width="100%" height={100} />
                                </div>
                            </div>

                            <div className={styles.profileMatches}>
                                <Skeleton variant="text" width={120} height={30} />
                                <Skeleton variant="rectangular" width="100%" height={100} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}