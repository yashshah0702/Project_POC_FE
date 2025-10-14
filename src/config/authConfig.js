// Get the current origin (works for both localhost and production)
const getRedirectUri = () => {
  return window.location.origin + "/";
};

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: import.meta.env.VITE_AUTHORITY,
    redirectUri: getRedirectUri(),
    postLogoutRedirectUri: getRedirectUri(),
  },
  cache: {
    cacheLocation: "sessionStorage", // or "localStorage"
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case "Error":
            console.error(message);
            return;
          case "Info":
            console.info(message);
            return;
          case "Verbose":
            console.debug(message);
            return;
          case "Warning":
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  // scopes: ["User.Read", "openid", "profile"],
  scopes: [`${import.meta.env.VITE_AUD_KEY}/access_as_user`],
  redirectUri: getRedirectUri(),
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
