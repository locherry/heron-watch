import { SecureStorage } from "@/class/SecureStorage"

export function useAuth() {
    return SecureStorage.get('user_session')
    // return true
}