import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProfileSetup } from './pages/ProfileSetup';
import { Dashboard } from './pages/Dashboard';
import { CareerRecommendations } from './pages/CareerRecommendations';
import { EducationGuidance } from './pages/EducationGuidance';
import { JobsSkills } from './pages/JobsSkills';
import { AIChatbot } from './pages/AIChatbot';
import { Notifications } from './pages/Notifications';
import { AptitudeTest } from './pages/AptitudeTest';
import { ForgotPassword } from './pages/ForgotPassword';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/careers" element={<CareerRecommendations />} />
        <Route path="/education" element={<EducationGuidance />} />
        <Route path="/jobs" element={<JobsSkills />} />
        <Route path="/chatbot" element={<AIChatbot />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/aptitude-test" element={<AptitudeTest />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
