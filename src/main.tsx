import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router";
import Router from './Router.tsx'
import Auth0ProviderNavigate from './components/auth0/Auth0ProviderNavigate.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderNavigate>
        <Router />
      </Auth0ProviderNavigate>
    </BrowserRouter>
  </StrictMode>,
)
