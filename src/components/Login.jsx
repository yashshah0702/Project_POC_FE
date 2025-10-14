import React, { useState, useEffect, useRef } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import { getData } from "../services/api-services";
import { apiPaths } from "../constants/apiPaths";

const Login = () => {
  const { instance, accounts } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const apiCalledRef = useRef(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const handleInitialAuth = async () => {
      // Only proceed if we haven't called the API yet
      if (!apiCalledRef.current) {
        const currentAccounts = instance.getAllAccounts();
        if (currentAccounts.length > 0) {
          try {
            setIsLoading(true);
            apiCalledRef.current = true; // Mark API as called before making the request

            // Acquire token silently
            const response = await instance.acquireTokenSilent({
              ...loginRequest,
              account: currentAccounts[0],
            });

            const accessToken = response.accessToken;
            localStorage.setItem("accessToken", accessToken);

            // Call backend API
            await getData(apiPaths.LOGIN, "POST", null, accessToken);
          } catch (error) {
            console.error("Token/API error:", error);
            if (error.name === "InteractionRequiredAuthError") {
              // If silent token acquisition fails, handle it appropriately
              setIsLoading(false);
            }
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    handleInitialAuth();
  }, [instance]); // Only depend on instance

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await instance.loginRedirect(loginRequest);
      // Note: The actual token acquisition and API call will happen after redirect
      // when the useEffect runs again with the new account
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 via-transparent to-cyan-900/50"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs */}
        <div className="absolute -top-64 -left-64 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl animate-float"></div>
        <div className="absolute -bottom-64 -right-64 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl animate-pulse"></div>

        {/* Geometric patterns */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
        <div className="absolute top-32 right-32 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-40 left-40 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div
          className={`w-full max-w-lg transition-all duration-1000 transform ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Main Login Card */}
          <div className="group relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-all duration-500"></div>

            {/* Card content */}
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">
              {/* Header Section */}
              <div className="text-center mb-10">
                {/* Brand Logo */}
                <div className="relative mx-auto w-15 h-15 mb-8 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rotate-45 transform transition-transform duration-300 group-hover:rotate-90"></div>
                  {/* Inner hexagon */}
                  <div className="absolute inset-1 bg-slate-900 rotate-45"></div>
                  {/* Center dot */}
                  <div className="absolute inset-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                  {/* Animated particles */}
                  <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                  <div
                    className="absolute bottom-1 left-1 w-1 h-1 bg-purple-400 rounded-full animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>

                {/* Welcome Text */}
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent leading-tight">
                    Welcome
                  </h1>
                  <p className="text-slate-300 text-lg font-medium max-w-md mx-auto leading-relaxed">
                    Sign in to access your account
                  </p>
                </div>
              </div>

              {/* Login Section */}
              <div className="space-y-8">
                {/* Microsoft Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="group relative w-full overflow-hidden"
                >
                  {/* Button background with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl transform transition-transform duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 transition-opacity duration-300"></div>

                  {/* Button content */}
                  <div className="cursor-pointer relative flex items-center justify-center py-5 px-8 text-white font-semibold text-lg">
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                        <span>Connecting to Microsoft...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {/* Microsoft Logo */}
                        <div className="flex-shrink-0 w-8 h-8 relative">
                          <div className="grid grid-cols-2 gap-0.5 w-full h-full">
                            <div className="bg-red-500 rounded-sm"></div>
                            <div className="bg-green-500 rounded-sm"></div>
                            <div className="bg-blue-500 rounded-sm"></div>
                            <div className="bg-yellow-500 rounded-sm"></div>
                          </div>
                        </div>
                        <span className="transition-transform duration-200">
                          Continue with Microsoft
                        </span>
                        <svg
                          className="w-5 h-5 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`text-center mt-8 space-y-4 transition-all duration-1000 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
              By continuing, you acknowledge that you have read and agree to our
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer ml-1">
                Terms of Service
              </span>{" "}
              and
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer ml-1">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
