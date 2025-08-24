import React, { useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";

export const meta = () => [
    { title: "Resumind | Auth" },
    { name: "description", content: "Log into your account" },
];

const Auth = () => {
    const { auth, isLoading, init, error, clearError } = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const next = queryParams.get("next") || "/";

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next, { replace: true });
        }
    }, [auth.isAuthenticated, navigate, next]);

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg max-w-sm w-full">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-3xl font-semibold">Welcome</h1>
                        <h2 className="text-lg">Log In to Continue Your Job Journey</h2>
                    </div>

                    {error && (
                        <div className="text-red-600 text-center">
                            <p>{error}</p>
                            <button className="text-blue-600 underline" onClick={clearError}>
                                Dismiss
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <button className="auto-button animate-pulse" disabled>
                            Signing you in...
                        </button>
                    ) : (
                        <button className="auth-button" onClick={auth.signIn}>
                            Log In
                        </button>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Auth;
