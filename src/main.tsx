import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Router from "./Router.tsx";
import Navbar from "./components/Navbar.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from "sonner";
import Auth0ProviderNavigate from "./components/auth0/Auth0ProviderNavigate.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Auth0ProviderNavigate>
      <AuthProvider>
        <Toaster />
        <Router />
        <Navbar />
      </AuthProvider>
    </Auth0ProviderNavigate>
  </BrowserRouter>
);
