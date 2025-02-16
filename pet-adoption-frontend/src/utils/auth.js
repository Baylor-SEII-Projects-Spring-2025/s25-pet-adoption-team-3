
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const loginWithGoogle = () => {
    window.location.href = `${API_URL}/oauth2/authorization/google`;
};