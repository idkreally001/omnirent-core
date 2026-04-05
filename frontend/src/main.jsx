import "./instrument"; // MUST be the first import

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { reactErrorHandler } from "@sentry/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root');

// React 19 Sentry error handlers
const root = createRoot(container, {
  onUncaughtError: reactErrorHandler(),
  onCaughtError: reactErrorHandler(),
  onRecoverableError: reactErrorHandler(),
});

root.render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>
);
