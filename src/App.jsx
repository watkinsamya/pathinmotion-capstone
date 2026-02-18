import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ResumeUpload from "./pages/ResumeUpload";
import Matches from "./pages/Matches";
import Mentors from "./pages/Mentors";
import Scholarships from "./pages/Scholarships";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/resume" element={<ResumeUpload />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/mentors" element={<Mentors />} />
      <Route path="/scholarships" element={<Scholarships />} />
    </Routes>
  );
}
