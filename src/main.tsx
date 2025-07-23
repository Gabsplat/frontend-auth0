import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import Router from "./Router.tsx";
import Navbar from "./components/Navbar.tsx";
import Auth0ProviderNavigate from "./components/auth0/Auth0ProviderNavigate.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";

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
