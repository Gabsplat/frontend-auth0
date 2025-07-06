import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import CallbackPage from "./components/auth0/CallbackPage";
import AuthenticationGuard from "./components/auth0/AuthenticationGuard";
import HiddenTest from "./pages/HiddenTest";

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/hidden" element={<AuthenticationGuard component={HiddenTest} />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}  
