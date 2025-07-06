import { withAuthenticationRequired } from "@auth0/auth0-react";

type ComponentType = React.ComponentType<Object>;

export default function AuthenticationGuard({ component }: { component: ComponentType }) {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => <div>Redirecting to login...</div>,
    })

    return <Component />
}
