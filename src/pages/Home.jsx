import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold mb-4">PathinMotion</h1>
      <p className="text-gray-400 max-w-xl mb-6">
        AI-powered career platform helping early-career professionals find jobs, mentors, scholarships, and personalized opportunities.
      </p>

      <div className="flex gap-4">
        <Link to="/register" className="bg-pink-500 px-6 py-2 rounded font-semibold">
          Get Started
        </Link>
        <Link to="/login" className="border border-gray-600 px-6 py-2 rounded">
          Sign In
        </Link>
      </div>
    </div>
  );
}
