import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Router from "./Router.tsx";
import Auth0ProviderNavigate from "./components/auth0/Auth0ProviderNavigate.tsx";
import Navbar from "./components/Navbar.tsx";
import { LoginHandler } from "./auth/LoginHandler.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderNavigate>
        <LoginHandler />
        <Router />
        <Navbar />
      </Auth0ProviderNavigate>
    </BrowserRouter>
  </StrictMode>
);
