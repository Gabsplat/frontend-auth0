import { useAuth0 } from "@auth0/auth0-react";

export default function CallbackPage() {
    const { error } = useAuth0();

    if (error) {
        return <div>{error.message}</div>
    }

    return <div>Cargando...</div>
}
