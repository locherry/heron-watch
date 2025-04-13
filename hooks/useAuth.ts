import { SecureStorage } from "@/classes/SecureStorage"

export function useAuth() {
    return SecureStorage.get('user_session')
    // return true
}