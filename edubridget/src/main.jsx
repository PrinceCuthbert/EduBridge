import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";
import "./i18n";
import { initMockBackend } from "./utils/mockBackend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize Mock Backend
initMockBackend();

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cachesTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <GoogleOAuthProvider
          clientId={clientId}
          onScriptLoadError={() =>
            console.error("Failed to load Google OAuth script")
          }
        >
          <App />
        </GoogleOAuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>,
);
