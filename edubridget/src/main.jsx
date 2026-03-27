import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";
import "./i18n";
import { initMockBackend } from "./utils/mockBackend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize Mock Backend
initMockBackend();

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
          <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>,
);
