import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useCallback, useEffect, useRef } from "react";

type ComponentType = React.ComponentType<Object>;

export default function AuthenticationGuard({
  component,
}: {
  component: ComponentType;
}) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const alreadySynced = useRef(false);

  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <div>Redirecting...</div>,
  });

  const syncUser = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alreadySynced.current = true;
      console.log("User synced");
    } catch (error) {
      console.error("Error registrando usuario:", error);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated && !alreadySynced.current) {
      syncUser();
    }
  }, [isAuthenticated, syncUser]);

  return <Component />;
}
