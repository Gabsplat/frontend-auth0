import { useAuth0 } from "@auth0/auth0-react";

export default function LoginButton() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    if (isAuthenticated) {
        return <div>Already authenticated</div>
    }

    return (
        <button onClick={() => loginWithRedirect({
            appState: {
                returnTo: window.location.pathname,
            }
        })}>Login</button>
    )
}