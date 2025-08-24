import type { Route } from "./+types/home";
import Navbar from "~/Components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/Components/ResumeCard";
import React, { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { useNavigate, useLocation } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, isLoading, init } = usePuterStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [chatComponent, setChatComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(
        `/auth?next=${encodeURIComponent(location.pathname + location.search)}`,
        { replace: true }
      );
    }
  }, [auth.isAuthenticated, isLoading, navigate, location]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.puter?.ai?.chat) {
      window.puter.ai.chat().then(setChatComponent);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">Loading...</div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />
      {chatComponent}
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Applications & Resume Ratings</h1>
          <h2>Review your submissions and check AI-powered feedback.</h2>
        </div>
      </section>
      {resumes.length > 0 && (
        <section className="flex flex-wrap gap-4 justify-center p-4">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </section>
      )}
    </main>
  );
}
