import { usePathname, useRouter } from "expo-router";
import React from "react";
import { SecureStorage } from "../classes/SecureStorage";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(
    null,
  );
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    SecureStorage.get("userSession").then((session) => {
      if (session == null || session.id == 0) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setIsAuthenticated(true);
      }
    });
  }, []);

  return isAuthenticated;
}
