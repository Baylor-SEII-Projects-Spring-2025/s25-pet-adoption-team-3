import { Client, Account } from "appwrite";

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
    .setProject("67a40b33000e3c0eedac"); // Replace with your Appwrite project ID

const account = new Account(client);

// Function to login with email and password
export const loginWithEmail = async (email, password) => {
    try {
        const session = await account.createEmailSession(email, password);
        console.log("Login successful:", session);
        return session;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

// Function to login with Google OAuth
export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session("google", "http://localhost:3000/dashboard", "http://localhost:3000/");
    } catch (error) {
        console.error("Google OAuth failed", error);
    }
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
