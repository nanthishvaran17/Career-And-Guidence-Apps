import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Textarea } from '../components/ui/textarea';
import { useRoadmap } from '../context/RoadmapContext';
import {
  Brain, GraduationCap, MapPin, Target, User, ChevronRight, ChevronLeft, Save, Briefcase, FileText, Loader2, CheckCircle2
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { toast } from 'sonner';

export function ProfileSetup() {
  const navigate = useNavigate();
  const { setRoadmap } = useRoadmap();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing...");

  const [profile, setProfile] = useState<{
    name: string; age: string; gender: string; email: string; phone: string;
    location: string; preferredLanguage: string;
    educationLevel: string; stream: string; institutionName: string; completionYear: string;
    cgpa: string; favoriteSubjects: string; weakSubjects: string;
    interestedExams: string; prepLevel: string;
    techSkills: string; softSkills: string; skillLevel: string;
    interestedFields: string[]; hobbies: string; passionAreas: string;
    shortTermGoal: string; longTermGoal: string; dreamJob: string; workEnvironment: string;
    studyLocation: string; studyCity: string; courseMode: string;
    familyIncome: string; educationBudget: string; scholarshipRequired: boolean;
    resumeLink: string; portfolioLink: string;
    certificates: Array<{name: string, link: string}>;
  }>({
    name: '', age: '', gender: '', email: '', phone: '', location: '', preferredLanguage: '',

    educationLevel: '', stream: '', institutionName: '', completionYear: '',
    cgpa: '', favoriteSubjects: '', weakSubjects: '',
    interestedExams: '', prepLevel: 'Beginner',

    techSkills: '', softSkills: '', skillLevel: 'Beginner',
    interestedFields: [], hobbies: '', passionAreas: '',

    shortTermGoal: '', longTermGoal: '', dreamJob: '', workEnvironment: 'Hybrid',
    studyLocation: 'India', studyCity: '', courseMode: 'Online',

    familyIncome: '', educationBudget: '', scholarshipRequired: false,

    internships: '', jobExperience: '', projects: '',
    resumeLink: '', portfolioLink: '',
    certificates: [{ name: '', link: '' }]
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const url = userId ? `${API_BASE_URL}/api/users/profile?id=${userId}` : `${API_BASE_URL}/api/users/profile`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data) {
          const merged = { ...profile, ...data };
          if (data.profile_data) Object.assign(merged, data.profile_data);
          setProfile(prev => ({ ...prev, ...merged }));
        }
      })
      .catch(err => console.error("Failed to load profile", err));
  }, []);

  // Auto-save the current step's data silently before moving to next
  const saveProgress = async (currentProfile: typeof profile) => {
    setIsSaving(true);
    const storedUserId = localStorage.getItem('userId');
    const payload = {
      id: storedUserId,
      name: currentProfile.name,
      email: currentProfile.email,
      phone: currentProfile.phone,
      educationLevel: currentProfile.educationLevel,
      stream: currentProfile.stream,
      marks: currentProfile.cgpa,
      gender: currentProfile.gender,
      interests: JSON.stringify(currentProfile.interestedFields),
      location: currentProfile.location,
      institutionName: currentProfile.institutionName,
      careerPreference: currentProfile.workEnvironment,
      skills: JSON.stringify([currentProfile.techSkills, currentProfile.softSkills].filter(Boolean)),
      profileData: currentProfile
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        if (data.id) localStorage.setItem('userId', data.id.toString());
        if (currentProfile.name) localStorage.setItem('userName', currentProfile.name);
        toast.success('✅ Step saved!', { duration: 1500 });
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
      toast.error('Could not save. Check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await saveProgress(profile);
    setStep(prev => Math.min(prev + 1, totalSteps));
  };
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const storedUserId = localStorage.getItem('userId');

    // Fun rotating facts during generation
    const loadingFacts = [
      "Analyzing India job market trends...",
      "Calculating your skill match score...",
      "Finding best career paths for you...",
      "Building your personalized roadmap..."
    ];
    let factIndex = 0;
    const interval = setInterval(() => {
      factIndex = (factIndex + 1) % loadingFacts.length;
      setLoadingText(loadingFacts[factIndex]);
    }, 2000);

    const payload = {
      id: storedUserId,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      educationLevel: profile.educationLevel,
      stream: profile.stream,
      marks: profile.cgpa,
      gender: profile.gender,
      interests: JSON.stringify(profile.interestedFields),
      location: profile.location,
      institutionName: profile.institutionName,
      careerPreference: profile.workEnvironment,
      skills: JSON.stringify([profile.techSkills, profile.softSkills].filter(Boolean)),
      profileData: profile 
    };

    try {
      // 1. Save profile
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.id) localStorage.setItem('userId', data.id.toString());
      localStorage.setItem('userName', profile.name || 'User');

      // 2. Generate Roadmap
      const roadmapPayload = {
        name: profile.name || 'Student',
        age: parseInt(profile.age) || 18,
        status: profile.educationLevel || 'Student',
        city: profile.location || 'India',
        degree: profile.educationLevel || 'N/A',
        specialization: profile.stream || 'General',
        skills: [profile.techSkills, profile.softSkills].filter(Boolean),
        interests: profile.interestedFields.length ? profile.interestedFields : ['General'],
        certificates: profile.certificates,
        challenge: profile.weakSubjects || 'None',
        dream: profile.dreamJob || 'Successful Career'
      };

      const roadmapRes = await fetch(`${API_BASE_URL}/api/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roadmapPayload)
      });
      const roadmapData = await roadmapRes.json();
      
      if (roadmapRes.ok) {
        toast.success("Profile Analyzed & Roadmap Generated!");
        setRoadmap(roadmapData);
        navigate('/roadmap');
      } else {
        toast.error("Failed to generate roadmap. Please try again.");
      }

    } catch (err: any) {
      toast.error("Connection Error: " + err.message);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setLoadingText("Analyzing...");
    }
  };

  const handleMultiSelect = (field: string) => {
    setProfile(prev => {
      const current = prev.interestedFields as string[];
      if (current.includes(field)) return { ...prev, interestedFields: current.filter(f => f !== field) };
      return { ...prev, interestedFields: [...current, field] };
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 dark:bg-gray-900 min-h-screen">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            <span className={step >= 1 ? "text-blue-600 dark:text-blue-400 font-bold" : ""}>1. Personal</span>
            <span className={step >= 2 ? "text-blue-600 dark:text-blue-400 font-bold" : "hidden sm:inline"}>2. Academic</span>
            <span className={step >= 3 ? "text-blue-600 dark:text-blue-400 font-bold" : "hidden sm:inline"}>3. Skills</span>
            <span className={step >= 4 ? "text-blue-600 dark:text-blue-400 font-bold" : "hidden sm:inline"}>4. Goals</span>
            <span className={step >= 5 ? "text-blue-600 dark:text-blue-400 font-bold" : ""}>5. Professional</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        </div>

        <Card className="w-full shadow-xl border-t-4 border-blue-500 dark:bg-gray-800 dark:border-blue-400">
          <form onSubmit={handleSubmit} className="p-6 md:p-10 pb-32">
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><User className="w-6 h-6 text-blue-500" /> Basic & Financial Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="dark:text-gray-300">Full Name</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="John Doe"/></div>
                  <div><Label className="dark:text-gray-300">Age</Label><Input type="number" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})}/></div>
                  <div>
                    <Label className="dark:text-gray-300">Gender</Label>
                    <Select value={profile.gender} onValueChange={v => setProfile({...profile, gender: v})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="dark:text-gray-300">Email ID</Label><Input type="email" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">Mobile Number</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">Location (City, State, Country)</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">Preferred Language</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.preferredLanguage} onChange={e => setProfile({...profile, preferredLanguage: e.target.value})}/></div>
                </div>

                <h4 className="text-lg font-bold mt-8 text-gray-800 dark:text-white">Financial Background (Optional)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Family Income Range</Label>
                    <Select value={profile.familyIncome} onValueChange={v => setProfile({...profile, familyIncome: v})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue placeholder="Select Range" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="< 2.5 LPA">&lt; 2.5 LPA</SelectItem>
                        <SelectItem value="2.5 - 5 LPA">2.5 - 5 LPA</SelectItem>
                        <SelectItem value="5 - 8 LPA">5 - 8 LPA</SelectItem>
                        <SelectItem value="> 8 LPA">&gt; 8 LPA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="dark:text-gray-300">Education Budget</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.educationBudget} onChange={e => setProfile({...profile, educationBudget: e.target.value})}/></div>
                  <div className="flex items-center gap-2 mt-4 md:col-span-2">
                    <Checkbox id="scholarship" checked={profile.scholarshipRequired} onCheckedChange={v => setProfile({...profile, scholarshipRequired: v === true})} />
                    <Label htmlFor="scholarship" className="cursor-pointer dark:text-gray-300">I require a scholarship / financial aid</Label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><GraduationCap className="w-6 h-6 text-green-500" /> Educational Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Current Qualification</Label>
                    <Select value={profile.educationLevel} onValueChange={v => setProfile({...profile, educationLevel: v})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue placeholder="e.g. 10th, 12th, UG" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10th">Class 10</SelectItem>
                        <SelectItem value="12th">Class 12</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="UG">Undergraduate</SelectItem>
                        <SelectItem value="PG">Postgraduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="dark:text-gray-300">Course / Stream</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.stream} onChange={e => setProfile({...profile, stream: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">College / School Name</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.institutionName} onChange={e => setProfile({...profile, institutionName: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">Year of Study / Completion</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.completionYear} onChange={e => setProfile({...profile, completionYear: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">CGPA / Percentage</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.cgpa} onChange={e => setProfile({...profile, cgpa: e.target.value})}/></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="dark:text-gray-300">Favorite Subjects</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="e.g. Physics, Math" value={profile.favoriteSubjects} onChange={e => setProfile({...profile, favoriteSubjects: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">Weak Subjects</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="e.g. Chemistry" value={profile.weakSubjects} onChange={e => setProfile({...profile, weakSubjects: e.target.value})}/></div>
                </div>

                <h4 className="text-lg font-bold mt-8 text-gray-800 dark:text-white">Entrance Exam Preparation</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="dark:text-gray-300">Interested Exams</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="JEE, NEET, UPSC..." value={profile.interestedExams} onChange={e => setProfile({...profile, interestedExams: e.target.value})}/></div>
                  <div>
                    <Label className="dark:text-gray-300">Preparation Level</Label>
                    <Select value={profile.prepLevel} onValueChange={v => setProfile({...profile, prepLevel: v})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner / Just Started</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced / Ready</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><Brain className="w-6 h-6 text-purple-500" /> Skills & Passion</h3>
                
                <div>
                  <Label className="dark:text-gray-300">Technical Skills</Label>
                  <Textarea className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Programming, Data Analysis, CAD, Design..." value={profile.techSkills} onChange={e => setProfile({...profile, techSkills: e.target.value})} />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Soft Skills</Label>
                  <Textarea className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Leadership, Communication, Creativity..." value={profile.softSkills} onChange={e => setProfile({...profile, softSkills: e.target.value})} />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Overall Skill Level</Label>
                  <Select value={profile.skillLevel} onValueChange={v => setProfile({...profile, skillLevel: v})}>
                    <SelectTrigger className="w-1/2 dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                  <Label className="dark:text-gray-300 block mb-3">Interested Career Fields</Label>
                  <div className="flex flex-wrap gap-2">
                    {['AI & IT', 'Medical', 'Business', 'Government', 'Creative Arts', 'Engineering', 'Law'].map(f => (
                      <BadgeToggle key={f} label={f} active={profile.interestedFields.includes(f as never)} onClick={() => handleMultiSelect(f)} />
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="dark:text-gray-300">Hobbies</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.hobbies} onChange={e => setProfile({...profile, hobbies: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">Primary Passion Area</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.passionAreas} onChange={e => setProfile({...profile, passionAreas: e.target.value})}/></div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><Target className="w-6 h-6 text-red-500" /> Career Goals & Preferences</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label className="dark:text-gray-300">Short Term Goal</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="e.g. Intern at a tech company" value={profile.shortTermGoal} onChange={e => setProfile({...profile, shortTermGoal: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">Long Term Goal</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="e.g. Become a CTO" value={profile.longTermGoal} onChange={e => setProfile({...profile, longTermGoal: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">Dream Job</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.dreamJob} onChange={e => setProfile({...profile, dreamJob: e.target.value})}/></div>
                  <div>
                    <Label className="dark:text-gray-300">Preferred Work Environment</Label>
                    <Select value={profile.workEnvironment} onValueChange={v => setProfile({...profile, workEnvironment: v})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Field Work">Field Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                  <h4 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white mb-4"><MapPin className="w-5 h-5" /> Study Location Preferences</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="dark:text-gray-300">India / Abroad</Label>
                      <Select value={profile.studyLocation} onValueChange={v => setProfile({...profile, studyLocation: v})}>
                        <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue/></SelectTrigger>
                        <SelectContent><SelectItem value="India">India</SelectItem><SelectItem value="Abroad">Abroad</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div><Label className="dark:text-gray-300">Preferred City/State</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={profile.studyCity} onChange={e => setProfile({...profile, studyCity: e.target.value})}/></div>
                    <div>
                      <Label className="dark:text-gray-300">Course Preference</Label>
                      <Select value={profile.courseMode} onValueChange={v => setProfile({...profile, courseMode: v})}>
                        <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue/></SelectTrigger>
                        <SelectContent><SelectItem value="Online">Online</SelectItem><SelectItem value="Offline">Offline</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><Briefcase className="w-6 h-6 text-orange-500" /> Work Experience & Documents</h3>
                
                <div>
                  <Label className="dark:text-gray-300">Internship Experience</Label>
                  <Textarea className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Where did you intern? What was your role?" value={profile.internships} onChange={e => setProfile({...profile, internships: e.target.value})}/>
                </div>
                <div>
                  <Label className="dark:text-gray-300">Job Experience</Label>
                  <Textarea className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Previous job details if any..." value={profile.jobExperience} onChange={e => setProfile({...profile, jobExperience: e.target.value})}/>
                </div>
                <div>
                  <Label className="dark:text-gray-300">Projects Completed</Label>
                  <Textarea className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="List your massive projects..." value={profile.projects} onChange={e => setProfile({...profile, projects: e.target.value})}/>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white"><FileText className="w-5 h-5 text-indigo-500" /> My Certifications</h4>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setProfile(prev => ({ ...prev, certificates: [...prev.certificates, { name: '', link: '' }] }))}
                      className="text-xs font-bold gap-1 rounded-full border-blue-100 text-blue-600 hover:bg-blue-50"
                    >
                      + Add Certificate
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {profile.certificates.map((cert, index) => (
                      <div key={index} className="grid md:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 relative group">
                        <div>
                          <Label className="text-[10px] uppercase font-black text-gray-400">Certificate Name</Label>
                          <Input 
                            className="h-10 mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-xl" 
                            placeholder="e.g. Google Data Analytics" 
                            value={cert.name} 
                            onChange={e => {
                              const newCerts = [...profile.certificates];
                              newCerts[index].name = e.target.value;
                              setProfile({ ...profile, certificates: newCerts });
                            }} 
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] uppercase font-black text-gray-400">Certificate / Drive Link</Label>
                          <Input 
                            className="h-10 mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-xl" 
                            placeholder="https://" 
                            value={cert.link} 
                            onChange={e => {
                              const newCerts = [...profile.certificates];
                              newCerts[index].link = e.target.value;
                              setProfile({ ...profile, certificates: newCerts });
                            }} 
                          />
                        </div>
                        {profile.certificates.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => {
                              const newCerts = profile.certificates.filter((_, i) => i !== index);
                              setProfile({ ...profile, certificates: newCerts });
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-500 hover:text-white"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    {profile.certificates.length === 0 && (
                      <p className="text-center py-4 text-xs text-gray-400 font-medium italic">No certificates added yet. Add them to get better recommendations!</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-8 pt-6 border-t dark:border-gray-700">
                    <div>
                      <Label className="dark:text-gray-300">Resume Link (Google Drive / PDF)</Label>
                      <Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600 mt-1 rounded-xl" placeholder="https://" value={profile.resumeLink} onChange={e => setProfile({...profile, resumeLink: e.target.value})}/>
                    </div>
                    <div>
                      <Label className="dark:text-gray-300">Personal Portfolio Link</Label>
                      <Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600 mt-1 rounded-xl" placeholder="https://yourwebsite.com" value={profile.portfolioLink} onChange={e => setProfile({...profile, portfolioLink: e.target.value})}/>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-gray-100 dark:border-gray-800 p-4 px-6 md:px-20 z-50 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
              <Button type="button" variant="outline" onClick={handlePrev} disabled={step === 1} className="w-24 sm:w-32 dark:border-gray-600 dark:text-white">
                <ChevronLeft className="w-5 h-5 mr-1 sm:mr-2" /> Back
              </Button>

              <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
                Step {step} of {totalSteps}
              </div>

              {step < totalSteps ? (
                <Button type="button" onClick={handleNext} disabled={isSaving} className="w-24 sm:w-40 bg-blue-600 hover:bg-blue-700 text-white">
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving...</>
                  ) : (
                    <>Save & Next <ChevronRight className="w-5 h-5 ml-1" /></>
                  )}
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading} className="w-auto sm:w-48 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg animate-pulse hover:animate-none font-bold">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {loadingText}</> : <><Brain className="w-5 h-5 mr-2" /> Generate My Roadmap</>}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

function BadgeToggle({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-colors ${
        active ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 border border-transparent dark:border-gray-600'
      }`}
    >
      {label}
    </div>
  );
}
