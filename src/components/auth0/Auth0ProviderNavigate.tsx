import { type AppState, Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router";


export default function Auth0ProviderNavigate({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
    const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;

    const onRedirectCallback = (appState: AppState | undefined) => {
        navigate(appState?.returnTo || window.location.pathname);
    }

    if (!(domain && clientId && redirectUri)) {
        return null
    }

    console.log(domain, clientId, redirectUri);

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                audience,
                redirect_uri: redirectUri,
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    )
}
