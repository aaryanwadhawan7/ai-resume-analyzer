import type { Route } from "./+types/home";
import Navbar from '~/Components/Navbar';
import { resumes } from '../../CONSTANTS';
import ResumeCard from '~/Components/ResumeCard';
import  window  from '../lib/puter';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />
      {window.puter.ai.chat()}
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

