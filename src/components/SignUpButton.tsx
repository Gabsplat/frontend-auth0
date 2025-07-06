import { useAuth0 } from "@auth0/auth0-react";

export default function SignUpButton() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        <button onClick={() => loginWithRedirect({
            appState: {
                returnTo: window.location.pathname,
            },
            authorizationParams: {
                screen_hint: "signup",
            }
        })}>Sign Up</button>
    )
}
