import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/LogoutButton";
import LoginButton from "../components/LoginButton";
export default function HiddenTest() {
    const { getAccessTokenSilently } = useAuth0()

    const callApi = async () => {
        const token = await getAccessTokenSilently({
            authorizationParams: {
                audience: import.meta.env.VITE_AUTH0_AUDIENCE
            }
        })

        console.log(token)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/client`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response)

        return (
            <>
                <h1 className="text-3xl font-bold underline">Hola</h1>
                <LoginButton />
            </>
        )
    }

    return (
        <div>
            <LogoutButton />
            <button onClick={callApi}>Call API</button>
        </div>
    )
}
