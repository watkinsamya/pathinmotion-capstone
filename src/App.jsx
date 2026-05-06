import { Routes, Route } from "react-router-dom";
import Home            from "./pages/Home";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Dashboard       from "./pages/Dashboard";
import Profile         from "./pages/Profile";
import ResumeUpload    from "./pages/ResumeUpload";
import Matches         from "./pages/Matches";
import Mentors         from "./pages/Mentors";
import MentorProfile   from "./pages/MentorProfile";
import MentorMessage   from "./pages/MentorMessage";
import Scholarships    from "./pages/Scholarships";
import Jobs            from "./pages/Jobs";
import JobDetails      from "./pages/JobDetails";
import AppliedJobs     from "./pages/AppliedJobs";
import Recommendations from "./pages/Recommendations";
import ApplyJob        from "./pages/ApplyJob";

export default function App() {
  return (
    <Routes>
      <Route path="/"                        element={<Home />}           />
      <Route path="/login"                   element={<Login />}          />
      <Route path="/register"                element={<Register />}       />
      <Route path="/dashboard"               element={<Dashboard />}      />
      <Route path="/profile"                 element={<Profile />}        />
      <Route path="/resume"                  element={<ResumeUpload />}   />
      <Route path="/matches"                 element={<Matches />}        />
      <Route path="/mentors"                 element={<Mentors />}        />
      <Route path="/mentors/:id"             element={<MentorProfile />}  />
      <Route path="/mentors/:id/message"     element={<MentorMessage />}  />
      <Route path="/scholarships"            element={<Scholarships />}   />
      <Route path="/jobs"                    element={<Jobs />}           />
      <Route path="/jobs/:id"                element={<JobDetails />}     />
      <Route path="/apply/:id"               element={<ApplyJob />}       />
      <Route path="/applied-jobs"            element={<AppliedJobs />}    />
      <Route path="/recommendations"         element={<Recommendations />}/>
    </Routes>
  );
}