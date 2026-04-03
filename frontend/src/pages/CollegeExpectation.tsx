import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import {
  GraduationCap, MapPin, Building2, TrendingUp, ChevronRight, ChevronLeft, Brain, Search, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config';

export function CollegeExpectation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing...");

  const [prefs, setPrefs] = useState({
    // Step 1
    course: '',
    specialization: '',
    collegeType: '',
    // Step 2
    country: 'India',
    state: '',
    city: '',
    maxDistance: 50,
    budget: '',
    scholarshipNeeded: false,
    scholarshipType: '',
    // Step 3
    urbanPreference: '',
    facilities: [] as string[],
    // Step 4
    placementRequired: false,
    minSalary: '',
    dreamSalary: '',
    priority: ''
  });

  const handleFacilityToggle = (facility: string) => {
    setPrefs(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    const facts = [
      "Calculating College Trust Scores...",
      "Matching location and budget constraints...",
      "Analyzing placement statistics...",
      "Building your 4-year success roadmap..."
    ];
    let fIdx = 0;
    const ival = setInterval(() => {
      fIdx = (fIdx + 1) % facts.length;
      setLoadingText(facts[fIdx]);
    }, 2000);

    try {
      const storedProfile = localStorage.getItem('userProfile');
      const profile = storedProfile ? JSON.parse(storedProfile) : { name: "Student" };
      
      const res = await fetch(`${API_BASE_URL}/api/advisory/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, expectations: prefs })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('advisory_data', JSON.stringify(data));
      toast.success("AI Synthesis Complete!");
      navigate('/advisory-dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Validation failed');
    } finally {
      clearInterval(ival);
      setIsAnalyzing(false);
      setLoadingText("Analyzing...");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 dark:bg-gray-900 min-h-screen">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            <span className={step >= 1 ? "text-indigo-600 dark:text-indigo-400 font-bold" : ""}>1. Academic</span>
            <span className={step >= 2 ? "text-indigo-600 dark:text-indigo-400 font-bold" : "hidden sm:inline"}>2. Location/Fees</span>
            <span className={step >= 3 ? "text-indigo-600 dark:text-indigo-400 font-bold" : "hidden sm:inline"}>3. Facilities</span>
            <span className={step >= 4 ? "text-indigo-600 dark:text-indigo-400 font-bold" : ""}>4. Priority & Placement</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        </div>

        <Card className="w-full shadow-2xl border-t-4 border-indigo-500 dark:bg-gray-800 dark:border-indigo-400 pb-20 relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300 via-gray-100 to-transparent"></div>

          <form onSubmit={handleSubmit} className="p-6 md:p-10 relative z-10">
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="border-b pb-4 dark:border-gray-700">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <GraduationCap className="w-8 h-8 text-indigo-500" /> Academic Expectations
                    </h3>
                    <p className="text-gray-500 mt-1 dark:text-gray-400">Tell us what you want to study and where.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="dark:text-gray-300 font-semibold mb-2 block">Preferred Course</Label>
                    <Select value={prefs.course} onValueChange={v => setPrefs({...prefs, course: v})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600 h-12"><SelectValue placeholder="Select Course" /></SelectTrigger>
                      <SelectContent>
                        {['B.Tech', 'B.Sc', 'B.Com', 'BBA', 'MBBS', 'Diploma'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="dark:text-gray-300 font-semibold mb-2 block">Preferred Branch / Specialization</Label>
                    <Select value={prefs.specialization} onValueChange={v => setPrefs({...prefs, specialization: v})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600 h-12"><SelectValue placeholder="Select Specialization" /></SelectTrigger>
                      <SelectContent>
                        {['Computer Science', 'Artificial Intelligence', 'Data Science', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Electronics'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="dark:text-gray-300 font-semibold mb-2 block">Preferred College Type</Label>
                    <div className="flex flex-wrap gap-3">
                        {['Government College', 'Private College', 'Autonomous College', 'Deemed University'].map(type => (
                            <div key={type} onClick={() => setPrefs({...prefs, collegeType: type})} className={`px-5 py-3 rounded-xl border cursor-pointer font-medium transition-all ${prefs.collegeType === type ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}>
                                {type}
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="border-b pb-4 dark:border-gray-700">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <MapPin className="w-8 h-8 text-emerald-500" /> Location & Financials
                    </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div><Label className="dark:text-gray-300">Country</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" value={prefs.country} onChange={e => setPrefs({...prefs, country: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">State</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="e.g. Tamil Nadu" value={prefs.state} onChange={e => setPrefs({...prefs, state: e.target.value})}/></div>
                  <div><Label className="dark:text-gray-300">City / District</Label><Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="e.g. Chennai" value={prefs.city} onChange={e => setPrefs({...prefs, city: e.target.value})}/></div>
                </div>

                <div>
                    <Label className="dark:text-gray-300 mb-4 block">Maximum Distance from Home (km): <span className="font-bold text-emerald-600">{prefs.maxDistance} km</span></Label>
                    <Slider value={[prefs.maxDistance]} max={2000} step={10} onValueChange={(val) => setPrefs({...prefs, maxDistance: val[0]})} className="w-full" />
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t dark:border-gray-700 pt-6">
                  <div>
                    <Label className="dark:text-gray-300 font-semibold mb-2 block">Fees Budget (Annual)</Label>
                    <Select value={prefs.budget} onValueChange={v => setPrefs({...prefs, budget: v})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue placeholder="Select Budget" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under 50,000">Under ₹50,000 per year</SelectItem>
                        <SelectItem value="50,000 - 1,50,000">₹50,000 – ₹1,50,000</SelectItem>
                        <SelectItem value="1,50,000 - 3,00,000">₹1,50,000 – ₹3,00,000</SelectItem>
                        <SelectItem value="Above 3,00,000">Above ₹3,00,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Checkbox id="scholarship" checked={prefs.scholarshipNeeded} onCheckedChange={v => setPrefs({...prefs, scholarshipNeeded: v === true})} />
                        <Label htmlFor="scholarship" className="font-semibold dark:text-gray-300 cursor-pointer">I need a Scholarship</Label>
                    </div>
                    {prefs.scholarshipNeeded && (
                      <Select value={prefs.scholarshipType} onValueChange={v => setPrefs({...prefs, scholarshipType: v})}>
                        <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600"><SelectValue placeholder="Scholarship Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Government">Government Scholarship</SelectItem>
                          <SelectItem value="Private">Private Scholarship</SelectItem>
                          <SelectItem value="Any">Either</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="border-b pb-4 dark:border-gray-700">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <Building2 className="w-8 h-8 text-orange-500" /> Infrastructure & Environment
                    </h3>
                </div>

                <div>
                    <Label className="dark:text-gray-300 font-semibold mb-4 block">Campus Environment Preference</Label>
                    <div className="flex gap-4">
                        {['Urban Campus', 'Semi-Urban Campus', 'Rural Campus'].map(env => (
                            <div key={env} onClick={() => setPrefs({...prefs, urbanPreference: env})} className={`flex-1 py-4 text-center rounded-xl border-2 cursor-pointer font-bold transition-all ${prefs.urbanPreference === env ? 'bg-orange-50 text-orange-600 border-orange-500 dark:bg-orange-900/30 dark:border-orange-500 dark:text-orange-300' : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}>
                                {env}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <Label className="dark:text-gray-300 font-semibold mb-4 block">College Facilities Required</Label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {['Hostel Facility', 'WiFi Campus', 'Library', 'Sports Facilities', 'Advanced Labs', 'Transportation'].map(facility => (
                            <div key={facility} onClick={() => handleFacilityToggle(facility)} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${prefs.facilities.includes(facility) ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
                                <Checkbox checked={prefs.facilities.includes(facility)} className={prefs.facilities.includes(facility) ? "border-white bg-white/20" : ""} />
                                <span className="font-semibold text-sm">{facility}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="border-b pb-4 dark:border-gray-700">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <TrendingUp className="w-8 h-8 text-purple-500" /> Priorities & Placements
                    </h3>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/50">
                    <div className="flex items-center gap-3 mb-6">
                        <Checkbox id="placement" className="w-6 h-6 border-purple-500 text-purple-600" checked={prefs.placementRequired} onCheckedChange={v => setPrefs({...prefs, placementRequired: v === true})} />
                        <Label htmlFor="placement" className="text-xl font-bold text-purple-900 dark:text-purple-300 cursor-pointer">Placement Required from College?</Label>
                    </div>

                    {prefs.placementRequired && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div><Label className="text-purple-800 dark:text-purple-400 font-semibold">Expected Minimum Salary Package</Label><Input className="mt-2 bg-white dark:bg-gray-800 border-purple-200" placeholder="e.g. 5 LPA" value={prefs.minSalary} onChange={e => setPrefs({...prefs, minSalary: e.target.value})}/></div>
                            <div><Label className="text-purple-800 dark:text-purple-400 font-semibold">Dream Salary Package</Label><Input className="mt-2 bg-white dark:bg-gray-800 border-purple-200" placeholder="e.g. 15+ LPA" value={prefs.dreamSalary} onChange={e => setPrefs({...prefs, dreamSalary: e.target.value})}/></div>
                        </div>
                    )}
                </div>

                <div>
                    <Label className="dark:text-gray-300 font-semibold mb-4 block">Ultimate Priority Selection (Help AI pick correctly)</Label>
                    <div className="flex flex-wrap gap-4">
                        {['Placement Quality', 'Low Fees Structure', 'High College Ranking', 'Close to Location', 'Modern Facilities'].map(pri => (
                            <div key={pri} onClick={() => setPrefs({...prefs, priority: pri})} className={`px-6 py-4 rounded-full border-2 cursor-pointer font-bold transition-all shadow-sm ${prefs.priority === pri ? 'bg-purple-600 text-white border-purple-600 scale-105' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}>
                                {pri}
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 px-6 md:px-10 z-50 flex justify-between items-center rounded-b-xl">
              <Button type="button" variant="outline" onClick={() => setStep(s => Math.max(s - 1, 1))} disabled={step === 1} className="w-24 sm:w-32 dark:border-gray-600 dark:text-white">
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
              </Button>

              <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Analysis Step {step} of {totalSteps}
              </div>

              {step < totalSteps ? (
                <Button type="button" onClick={() => setStep(s => Math.min(s + 1, totalSteps))} className="w-24 sm:w-32 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Next <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              ) : (
                <Button type="submit" disabled={isAnalyzing} className="w-auto px-6 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:opacity-90 text-white shadow-xl font-bold text-lg h-12 rounded-xl">
                  {isAnalyzing ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {loadingText}</>
                  ) : (
                    <><Brain className="w-6 h-6 mr-2 animate-bounce flex-shrink-0" /> Analyze College Matches</>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
