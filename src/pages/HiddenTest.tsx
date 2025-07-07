import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
export default function HiddenTest() {
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0();

  const callApi = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    const idToken = await getIdTokenClaims();

    console.log(token);
    console.log(idToken?.__raw);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
  };

  const loginBackend = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
  };

  return (
    <div className="flex flex-col gap-4">
      <LogoutButton />
      <button onClick={callApi}>Call API</button>
      <button onClick={loginBackend}>Login to Backend</button>
    </div>
  );
}
