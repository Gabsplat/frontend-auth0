import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface BackendLoginResponse {
  role: "paciente" | "dentista" | "administrador";
}

export function LoginHandler() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || done) return;

    (async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              auth0Id: user?.sub,
              nombre: user?.given_name || user?.name || "Default",
              email: user?.email,
            }),
          }
        );

        if (!res.ok) {
          console.error("Backend login falló:", await res.text());
          return;
        }

        const { role } = (await res.json()) as BackendLoginResponse;
        console.log("Rol del usuario:", role);

        switch (role) {
          case "paciente":
            navigate("/dashboard/paciente", { replace: true });
            break;
          case "dentista":
            navigate("/dashboard/dentista", { replace: true });
            break;
          case "administrador":
            navigate("/dashboard/admin", { replace: true });
            break;
          default:
            navigate("/dashboard", { replace: true });
        }
      } catch (e) {
        console.error("Error en LoginHandler:", e);
      } finally {
        setDone(true);
      }
    })();
  }, [isAuthenticated, getAccessTokenSilently, user, done, navigate]);

  return null;
}
