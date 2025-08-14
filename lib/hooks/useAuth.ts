import { router } from "expo-router"; // Navigation handling for Expo
import { SecureStorage } from "../classes/SecureStorage"; // Our custom secure storage utility

// Checks if the user is authenticated
export async function useAuth() {
    // Retrieve the stored user session from secure storage
    const userSession = await SecureStorage.get('userSession');

    // If no session is stored OR if it’s the default session (id = 0), redirect to login
    if (userSession == null || userSession?.id == 0) {
        router.replace('/login'); // Navigate to login page without adding to history
    }

    // Return true if there’s a valid session (id != 0), false otherwise
    // This ensures a "default" session still counts as unauthenticated
    return userSession?.id != 0;
}
