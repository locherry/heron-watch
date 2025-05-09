import { SecureStorage } from "@/classes/SecureStorage"
import { router } from "expo-router";

export async function useAuth() {
    const userSession = await SecureStorage.get('user_session');
    if (userSession?.id == 0) {
        router.replace('/login')
    }
    // There is always a session stored, but if it is the default session, with the id=0, return false :
    return userSession?.id != 0; // returns true or false
}