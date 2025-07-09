import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export function useLogin() {
  const { loginWithRedirect } = useAuth0();
  return useCallback(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);
}
