import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProfileSetup } from './pages/ProfileSetup';
import { Dashboard } from './pages/Dashboard';
import { CareerRecommendations } from './pages/CareerRecommendations';
import { EducationGuidance } from './pages/EducationGuidance';
import { JobsSkills } from './pages/JobsSkills';
import { Experts } from './pages/Experts';
import { AIChatbot } from './pages/AIChatbot';
import { Notifications } from './pages/Notifications';
import { AptitudeTest } from './pages/AptitudeTest';
import { ComparisonTool } from './pages/ComparisonTool';
import { ForgotPassword } from './pages/ForgotPassword';
import { CollegeExpectation } from './pages/CollegeExpectation';
import { ChangePassword } from './pages/ChangePassword';
import { ActivityLog } from './pages/ActivityLog';
import { Roadmap } from './pages/Roadmap';
import { AdvisoryDashboard } from './pages/AdvisoryDashboard';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { CareerSimulation } from './pages/CareerSimulation';
import { RoadmapProvider } from './context/RoadmapContext';

export default function App() {
  return (
    <RoadmapProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/careers" element={<CareerRecommendations />} />
          <Route path="/education" element={<EducationGuidance />} />
          <Route path="/college-expectations" element={<CollegeExpectation />} />
          <Route path="/advisory-dashboard" element={<AdvisoryDashboard />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/career-simulation" element={<CareerSimulation />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/jobs" element={<JobsSkills />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/chatbot" element={<AIChatbot />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/aptitude-test" element={<AptitudeTest />} />
          <Route path="/compare" element={<ComparisonTool />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </RoadmapProvider>
  );
}
