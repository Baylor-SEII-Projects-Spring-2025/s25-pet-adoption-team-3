export const loginWithGoogle = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

// Function to get the current user session
export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        console.error("No active session found", error);
        return null;
    }
};

// Function to log out
export const logout = async () => {
    try {
        await account.deleteSession("current");
        console.log("User logged out");
    } catch (error) {
        console.error("Logout failed", error);
    }
};
