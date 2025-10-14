import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/authConfig";
import App from "./App.jsx";
import "./index.css";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL and handle redirects
const initializeMsal = async () => {
  try {
    // Initialize MSAL first - THIS IS CRUCIAL
    await msalInstance.initialize();

    // Then handle redirect promise
    await msalInstance.handleRedirectPromise();

    // Default to using the first account if no account is active on page load
    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
      msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    // Listen for sign-in event and set active account
    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
        console.log("Login successful, active account set:", account);
      }

      if (event.eventType === EventType.LOGIN_FAILURE) {
        console.error("Login failed:", event.error);
      }
    });

    // Render the app after MSAL initialization
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("MSAL initialization error:", error);
  }
};

// Initialize MSAL
initializeMsal();
