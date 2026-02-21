import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Brain, GraduationCap, MapPin, BookOpen, TrendingUp, User, Briefcase, Award, Zap, Smile, Target, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { toast } from 'sonner';

export function ProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [isLoading, setIsLoading] = useState(false);

  // Advanced Profile State
  const [profile, setProfile] = useState({
    // Basic
    name: '', phone: '', dob: '', gender: '', location: '', city: '',

    // Academic
    educationLevel: '', stream: '', marks: '', institutionName: '', boardUniversity: '', completionYear: '',
    educationHistory: {
      class10: { schoolName: '', board: '', marks: '' },
      class12: { schoolName: '', stream: '', board: '', marks: '' },
      ug: { degree: '', specialization: '' }
    },
    subjectGrades: { math: '', science: '', english: '', cs: '' },
    learningConsistency: 'steady', academicTrend: 'increasing',

    // Interests (1-5 Scale)
    interestSignals: {
      programming: 3, ai: 1, cyberSecurity: 1, dataAnalysis: 1,
      electronics: 1, research: 1, management: 1, design: 1, teaching: 1, publicSector: 1
    },

    // Hobbies
    hobbies: [] as string[],

    // Skills
    skills: [] as string[],
    topSkills: { coding: 'Beginner', tools: 'Beginner', communication: 'Average' },

    // Personality & Behavior
    learningStyle: 'visual',
    learningSpeed: 'medium',
    traits: { analytical: 3, creativity: 3, leadership: 3, stressHandling: 3 },

    // Goals & Preferences
    careerPreference: '', // Pvt/Govt
    workEnvironment: 'hybrid',
    shortTermGoal: '',
    longTermGoal: '',
    financialConstraint: 'medium',

    // Meta
    disability: false,
    category: 'General',
    familyIncome: ''
  });

  // Load existing profile
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const url = userId ? `${API_BASE_URL}/api/users/profile?id=${userId}` : `${API_BASE_URL}/api/users/profile`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data) {
          // Merge basic fields
          const merged = { ...profile, ...data };

          // Merge advanced nested JSON if exists
          if (data.profile_data) {
            Object.assign(merged, data.profile_data);
          }
          setProfile(prev => ({ ...prev, ...merged }));
        }
      })
      .catch(err => console.error("Failed to load profile", err));
  }, []);

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const storedUserId = localStorage.getItem('userId');
    console.log('🚀 Profile Submit - User ID:', storedUserId);

    const payload = {
      id: storedUserId,
      name: profile.name,
      phone: profile.phone,
      dob: profile.dob,
      educationLevel: profile.educationLevel,
      // Map top-level columns for SQL
      stream: (profile as any).educationHistory?.class12?.stream || '',
      marks: profile.marks, // Storing current (UG) marks in main column
      gender: profile.gender,
      interests: profile.hobbies,
      institutionName: profile.institutionName,
      careerPreference: profile.careerPreference,
      location: profile.location,

      // Store comprehensive data in JSON
      profileData: {
        educationHistory: (profile as any).educationHistory,
        subjectGrades: profile.subjectGrades,
        interestSignals: profile.interestSignals,
        traits: profile.traits,
        learningStyle: profile.learningStyle,
        learningSpeed: profile.learningSpeed,
        workEnvironment: profile.workEnvironment,
        shortTermGoal: profile.shortTermGoal,
        longTermGoal: profile.longTermGoal,
        financialConstraint: profile.financialConstraint,
        hobbies: profile.hobbies
      }
    };

    console.log('📦 Payload:', payload);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('📡 Response Status:', res.status);
      const data = await res.json();
      console.log('📥 Response Data:', data);

      if (res.ok) {
        toast.success("Profile Updated Successfully!");
        if (data.id) localStorage.setItem('userId', data.id.toString());
        // Update local storage names instantly for Sidebar
        localStorage.setItem('userName', profile.name);
        console.log('✅ Navigating to dashboard...');
        navigate('/dashboard');
      } else {
        console.error('❌ Server Error:', data.error);
        toast.error("Failed to save profile: " + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('❌ Connection Error:', err);
      toast.error("Connection Error");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right fade-in">
      <h3 className="text-xl font-bold flex items-center gap-2"><User className="w-5 h-5 text-indigo-600" /> Basic & Academic Profile</h3>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div><Label>Full Name</Label><Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="John Doe" /></div>
        <div><Label>Phone</Label><Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 9876543210" /></div>
        <div><Label>Date of Birth</Label><Input type="date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })} /></div>
        <div>
          <Label>Gender</Label>
          <Select value={profile.gender} onValueChange={v => setProfile({ ...profile, gender: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-500" /> Education History</h4>

        {/* Highest Qualification */}
        <div className="mb-6">
          <Label>Current Education Level</Label>
          <Select value={profile.educationLevel} onValueChange={v => setProfile({ ...profile, educationLevel: v })}>
            <SelectTrigger><SelectValue placeholder="Select Highest Qualification" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10th">Class 10 (Secondary)</SelectItem>
              <SelectItem value="12th">Class 12 (Higher Secondary)</SelectItem>
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="UG">Undergraduate (College)</SelectItem>
              <SelectItem value="PG">Postgraduate (Masters)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 10th Details - Always Visible */}
        <div className="bg-gray-50 p-4 rounded-lg border mb-4">
          <h5 className="font-medium text-gray-700 mb-2">Class 10 Details</h5>
          <div className="grid md:grid-cols-3 gap-3">
            <Input
              placeholder="School Name"
              value={(profile as any)?.educationHistory?.class10?.schoolName || ''}
              onChange={e => setProfile({ ...profile, educationHistory: { ...(profile as any).educationHistory, class10: { ...(profile as any).educationHistory?.class10, schoolName: e.target.value } } } as any)}
            />
            <Input
              placeholder="Board (e.g., State Board, CBSE)"
              value={(profile as any)?.educationHistory?.class10?.board || ''}
              onChange={e => setProfile({ ...profile, educationHistory: { ...(profile as any).educationHistory, class10: { ...(profile as any).educationHistory?.class10, board: e.target.value } } } as any)}
            />
            <Input
              placeholder="Overall % / CGPA"
              value={(profile as any)?.educationHistory?.class10?.marks || ''}
              onChange={e => setProfile({ ...profile, educationHistory: { ...(profile as any).educationHistory, class10: { ...(profile as any).educationHistory?.class10, marks: e.target.value } } } as any)}
            />
          </div>
        </div>

        {/* 12th / Diploma - Conditional */}
        {(['12th', 'Diploma', 'UG', 'PG'].includes(profile.educationLevel)) && (
          <div className="bg-gray-50 p-4 rounded-lg border mb-4">
            <h5 className="font-medium text-gray-700 mb-2">{profile.educationLevel === 'Diploma' ? 'Diploma' : 'Class 12'} Details</h5>
            <div className="grid md:grid-cols-4 gap-3">
              <Input
                placeholder={profile.educationLevel === 'Diploma' ? "College Name" : "School Name"}
                value={(profile as any)?.educationHistory?.class12?.schoolName || ''}
                onChange={e => setProfile({ ...profile, educationHistory: { ...(profile as any).educationHistory, class12: { ...(profile as any).educationHistory?.class12, schoolName: e.target.value } } } as any)}
              />
              <Input
                placeholder={profile.educationLevel === 'Diploma' ? "Stream (e.g., Mech, CSE)" : "Group (e.g., Bio-Maths)"}
                value={(profile as any)?.educationHistory?.class12?.stream || ''}
                onChange={e => setProfile({ ...profile, educationHistory: { ...(profile as any).educationHistory, class12: { ...(profile as any).educationHistory?.class12, stream: e.target.value } } } as any)}
              />
              <Input
                placeholder="Board / University"
                value={(profile as any)?.educationHistory?.class12?.board || ''}
                onChange={e => setProfile({ ...profile, educationHistory: { ...(profile as any).educationHistory, class12: { ...(profile as any).educationHistory?.class12, board: e.target.value } } } as any)}
              />
              <Input
                placeholder="Overall % / Cutoff"
                value={(profile as any)?.educationHistory?.class12?.marks || ''}
                onChange={e => setProfile({ ...profile, educationHistory: { ...(profile as any).educationHistory, class12: { ...(profile as any).educationHistory?.class12, marks: e.target.value } } } as any)}
              />
            </div>
          </div>
        )}

        {/* UG / PG - Conditional */}
        {(['UG', 'PG'].includes(profile.educationLevel)) && (
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
            <h5 className="font-medium text-indigo-800 mb-2">College / Degree</h5>
            <div className="grid md:grid-cols-2 gap-3 mb-2">
              <Input
                placeholder="Degree (e.g., B.E, B.Tech, B.Sc)"
                value={(profile as any)?.educationHistory?.ug?.degree || ''}
                onChange={e => setProfile({ ...profile, educationHistory: { ...(profile as any).educationHistory, ug: { ...(profile as any).educationHistory?.ug, degree: e.target.value } } } as any)}
              />
              <Input
                placeholder="Specialization (e.g., CSE, ECE)"
                value={(profile as any)?.educationHistory?.ug?.specialization || ''}
                onChange={e => setProfile({ ...profile, educationHistory: { ...(profile as any).educationHistory, ug: { ...(profile as any).educationHistory?.ug, specialization: e.target.value } } } as any)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="College Name"
                value={profile.institutionName}
                onChange={e => setProfile({ ...profile, institutionName: e.target.value })}
              />
              <Input
                placeholder="Current CGPA"
                value={profile.marks}
                onChange={e => setProfile({ ...profile, marks: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Subject Grades - Simplified or linked to latest */}
        <div className="mt-4">
          <Label className="mb-2 block">Key Subject Performance (Last Qualified Exam)</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Math', 'Science', 'English', 'CS'].map(sub => (
              <div key={sub}>
                <Label className="text-xs text-gray-500">{sub}</Label>
                <Select value={(profile.subjectGrades as any)[sub.toLowerCase()]} onValueChange={v => setProfile({ ...profile, subjectGrades: { ...profile.subjectGrades, [sub.toLowerCase()]: v } })}>
                  <SelectTrigger className="h-8"><SelectValue placeholder="Grade" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A (&gt;90%)</SelectItem>
                    <SelectItem value="B">B (&gt;75%)</SelectItem>
                    <SelectItem value="C">C (&gt;60%)</SelectItem>
                    <SelectItem value="D">D (&gt;40%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in slide-in-from-right fade-in">
      <h3 className="text-xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-600" /> Interest Signals (1-5 Scale)</h3>
      <p className="text-sm text-gray-500">Rate your interest level in these domains (1 = Low, 5 = High).</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {Object.entries(profile.interestSignals).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between">
            <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setProfile({ ...profile, interestSignals: { ...profile.interestSignals, [key]: rating } })}
                  className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${val === rating ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Hobbies & Activities</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['Coding', 'Gaming', 'Writing', 'Sports', 'Music', 'Check/Puzzle', 'Volunteering', 'Design', 'Photography'].map(hobby => (
            <div key={hobby} className="flex items-center space-x-2">
              <Checkbox
                id={hobby}
                checked={profile.hobbies.includes(hobby)}
                onCheckedChange={(checked) => {
                  setProfile(prev => ({
                    ...prev,
                    hobbies: checked
                      ? [...prev.hobbies, hobby]
                      : prev.hobbies.filter(h => h !== hobby)
                  }));
                }}
              />
              <label htmlFor={hobby} className="text-sm cursor-pointer">{hobby}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in slide-in-from-right fade-in">
      <h3 className="text-xl font-bold flex items-center gap-2"><Brain className="w-5 h-5 text-purple-600" /> Personality & Learning</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Learning Style</Label>
          <Select value={profile.learningStyle} onValueChange={v => setProfile({ ...profile, learningStyle: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="visual">Visual (Images/Videos)</SelectItem>
              <SelectItem value="practical">Practical (Doing/Hands-on)</SelectItem>
              <SelectItem value="reading">Reading/Theoretical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Learning Speed</Label>
          <Select value={profile.learningSpeed} onValueChange={v => setProfile({ ...profile, learningSpeed: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fast">Fast Paced</SelectItem>
              <SelectItem value="medium">Steady / Average</SelectItem>
              <SelectItem value="slow">Detailed / Slow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-gray-600">Self-Assessment Traits (1-5)</h4>
        {Object.entries(profile.traits).map(([trait, val]) => (
          <div key={trait} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="capitalize font-medium text-gray-700">{trait}</span>
            <input
              type="range" min="1" max="5" value={val}
              onChange={e => setProfile({ ...profile, traits: { ...profile.traits, [trait]: parseInt(e.target.value) } })}
              className="w-1/2 accent-indigo-600"
            />
            <span className="font-bold text-indigo-600 w-6 text-center">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-in slide-in-from-right fade-in">
      <h3 className="text-xl font-bold flex items-center gap-2"><Target className="w-5 h-5 text-red-600" /> Goals & Preferences</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Career Sector Preference</Label>
          <Select value={profile.careerPreference} onValueChange={v => setProfile({ ...profile, careerPreference: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Private">Private / Corporate</SelectItem>
              <SelectItem value="Government">Government / Public</SelectItem>
              <SelectItem value="Entrepreneurship">Startup / Business</SelectItem>
              <SelectItem value="Research">Research / Academia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Work Environment</Label>
          <Select value={profile.workEnvironment} onValueChange={v => setProfile({ ...profile, workEnvironment: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office (On-site)</SelectItem>
              <SelectItem value="remote">Remote (Work from Home)</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Short Term Goal (0-2 Years)</Label>
          <Input
            value={profile.shortTermGoal}
            onChange={e => setProfile({ ...profile, shortTermGoal: e.target.value })}
            placeholder="e.g. Get a high-paying job, Crack UPSC, Learn AI..."
            className="mt-1"
          />
        </div>
        <div>
          <Label>Long Term Goal (5-10 Years)</Label>
          <Input
            value={profile.longTermGoal}
            onChange={e => setProfile({ ...profile, longTermGoal: e.target.value })}
            placeholder="e.g. Become a CTO, Start a company, Research Scientist..."
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>Financial / Time Constraints</Label>
        <Select value={profile.financialConstraint} onValueChange={v => setProfile({ ...profile, financialConstraint: v })}>
          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High Constraints (Need Job ASAP)</SelectItem>
            <SelectItem value="medium">Medium (Can study for 1-2 years)</SelectItem>
            <SelectItem value="low">Low (Can invest in long education)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
            <span className={step >= 1 ? "text-indigo-600" : ""}>Basic Info</span>
            <span className={step >= 2 ? "text-indigo-600" : ""}>Interests</span>
            <span className={step >= 3 ? "text-indigo-600" : ""}>Traits</span>
            <span className={step >= 4 ? "text-indigo-600" : ""}>Goals</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-t-4 border-indigo-500">
          <form onSubmit={handleSubmit} className="p-8 pb-32">
            {/* Add pb-32 to create space for fixed footer */}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-indigo-100 p-4 px-6 md:px-20 z-50 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.1)] safe-area-bottom animate-in slide-in-from-bottom">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={step === 1}
                className="w-32 hover:bg-gray-100 transition-colors"
                size="lg"
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Back
              </Button>

              <div className="text-sm font-bold text-indigo-600 hidden md:flex flex-col items-center">
                <span>Step {step} of {totalSteps}</span>
                <div className="w-20 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                </div>
              </div>

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-32 gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  size="lg"
                >
                  Next <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-48 bg-green-600 hover:bg-green-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg font-bold"
                  size="lg"
                >
                  {isLoading ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Finish Setup</>}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
