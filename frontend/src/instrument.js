import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import {
    useLocation,
    useNavigationType,
    createRoutesFromChildren,
    matchRoutes,
} from "react-router-dom";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Add release if versioning is established
    release: "omnirent-core@1.0.0", 
    
    sendDefaultPii: true,

    integrations: [
        Sentry.browserTracingIntegration(),
        // React Router v7 integration
        Sentry.reactRouterV7BrowserTracingIntegration({
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],

    // Tracing
    tracesSampleRate: 1.0, // Adjust this in production (e.g. 0.1)
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Debugging (disabled in production usually)
    debug: false, 
});
