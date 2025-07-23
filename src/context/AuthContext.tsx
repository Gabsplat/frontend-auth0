/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Administrador, Dentista, Paciente } from "@/types/Usuarios";
import { useAuth0 } from "@auth0/auth0-react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type BackendLoginResponse =
  | { role: "paciente"; patient: Paciente }
  | { role: "dentista"; dentist: Dentista }
  | { role: "administrador"; administrator: Administrador };

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  userRole: "paciente" | "dentista" | "administrador" | null;
  backendUser: Paciente | Dentista | Administrador | null;
  login: () => void;
  logout: () => void;
  syncWithBackend: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated,
    isLoading: auth0Loading,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const getAccessToken = async () => {
    if (!isAuthenticated) return null;
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      return token;
    } catch {
      return null;
    }
  };

  const [userRole, setUserRole] = useState<
    "paciente" | "dentista" | "administrador" | null
  >(null);
  const [backendUser, setBackendUser] = useState<
    Paciente | Dentista | Administrador | null
  >(null);
  const [backendSynced, setBackendSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const syncWithBackend = async () => {
    if (!isAuthenticated || !user) return;

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
            auth0Id: user.sub,
            nombre: user.given_name || user.name || "Default",
            email: user.email,
          }),
        }
      );

      if (res.ok) {
        const data = (await res.json()) as BackendLoginResponse;
        console.log("Backend sync data:", data);
        let usuario: Paciente | Dentista | Administrador;

        switch (data.role) {
          case "paciente":
            usuario = data.patient;
            break;
          case "dentista":
            usuario = data.dentist;
            break;
          case "administrador":
            usuario = data.administrator;
            break;
        }

        setBackendUser(usuario);
        setUserRole(data.role);
        setBackendSynced(true);
      } else {
        console.error("Backend sync failed:", await res.text());
      }
    } catch (error) {
      console.error("Error syncing with backend:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !backendSynced) {
      syncWithBackend();
    }
  }, [isAuthenticated, backendSynced]);

  useEffect(() => {
    if (!auth0Loading) {
      setIsLoading(false);
    }
  }, [auth0Loading]);

  const login = () => {
    loginWithRedirect();
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    setUserRole(null);
    setBackendUser(null);
    setBackendSynced(false);
  };

  const value: AuthContextType = {
    getAccessToken,
    isAuthenticated,
    isLoading,
    user,
    userRole,
    backendUser,
    login,
    logout,
    syncWithBackend,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
