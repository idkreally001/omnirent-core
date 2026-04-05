import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import './index.css'
import App from './App.jsx'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>
);
