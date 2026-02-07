import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Brain, GraduationCap, MapPin, BookOpen, TrendingUp, User } from 'lucide-react';

export function ProfileSetup() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    dob: '',
    educationLevel: '',
    stream: '',
    marks: '',
    interests: [] as string[],
    location: '',
    category: '',
    gender: '',
    disability: false,
    familyIncome: '',
    careerPreference: '',
    targetExams: [] as string[]
  });

  const targetExamOptions = ['UPSC', 'TNPSC', 'Banking (IBPS/SBI)', 'Railways (RRB)', 'SSC', 'Teaching (NET/CTET)', 'Defense', 'Engineering (GATE/ESE)'];

  const handleExamToggle = (exam: string) => {
    setProfile(prev => ({
      ...prev,
      targetExams: prev.targetExams.includes(exam)
        ? prev.targetExams.filter(e => e !== exam)
        : [...prev.targetExams, exam]
    }));
  };

  const interests = [
    'Technology', 'Healthcare', 'Business', 'Arts', 'Science',
    'Engineering', 'Teaching', 'Sports', 'Music', 'Writing'
  ];

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Load Profile on Mount
  useEffect(() => {
    fetch('/api/users/profile')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProfile(prev => ({
            ...prev,
            ...data,
            // Ensure JSON fields are parsed if backend sends strings (though backend sends JSON objects now)
            interests: typeof data.interests === 'string' ? JSON.parse(data.interests) : data.interests || [],
            targetExams: typeof data.targetExams === 'string' ? JSON.parse(data.targetExams) : data.targetExams || [],
            disability: !!data.disability
          }));
        }
      })
      .catch(err => console.error("Failed to load profile", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save to LocalStorage (Legacy support/Frontend Cache)
    localStorage.setItem('userProfile', JSON.stringify(profile));

    // Save to Backend Database
    try {
      const res = await fetch('http://localhost:4000/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Profile saved to database", data);
        if (data.id) {
          const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
          localStorage.setItem('userProfile', JSON.stringify({ ...currentProfile, ...profile, id: data.id }));
          localStorage.setItem('userId', data.id.toString()); // Explicitly store ID for easier access
        }
      } else {
        console.error("Failed to save profile to DB");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }

    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">
            Help us understand you better to provide personalized career recommendations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="mb-1">Personal Details</h4>
                  <p className="text-sm text-gray-600">Basic contact and identification info</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      className="mt-1"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="e.g., 9876543210"
                      className="mt-1"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      className="mt-1"
                      value={profile.dob}
                      onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Education Level */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="mb-1">Education Details</h4>
                  <p className="text-sm text-gray-600">Tell us about your current education</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="educationLevel">Education Level</Label>
                    <Select
                      value={profile.educationLevel}
                      onValueChange={(value) => setProfile({ ...profile, educationLevel: value })}
                    >
                      <SelectTrigger id="educationLevel" className="mt-1">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10th">Class 10th</SelectItem>
                        <SelectItem value="12th">Class 12th</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate (College)</SelectItem>
                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Conditional Fields based on Education Level */}
                  {profile.educationLevel && (
                    <>
                      <div>
                        <Label htmlFor="institutionName">
                          {profile.educationLevel === 'undergraduate' || profile.educationLevel === 'postgraduate' || profile.educationLevel === 'diploma'
                            ? 'College/Institute Name' : 'School Name'}
                        </Label>
                        <Input
                          id="institutionName"
                          placeholder="e.g. ABC Public School / XYZ College"
                          className="mt-1"
                          value={(profile as any).institutionName || ''}
                          onChange={(e) => setProfile({ ...profile, institutionName: e.target.value } as any)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="boardUniversity">
                          {profile.educationLevel === 'undergraduate' || profile.educationLevel === 'postgraduate' || profile.educationLevel === 'diploma'
                            ? 'University/Board' : 'School Board'}
                        </Label>
                        <Input
                          id="boardUniversity"
                          placeholder="e.g. CBSE / Anna University"
                          className="mt-1"
                          value={(profile as any).boardUniversity || ''}
                          onChange={(e) => setProfile({ ...profile, boardUniversity: e.target.value } as any)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="completionYear">Year of Completion</Label>
                        <Input
                          id="completionYear"
                          placeholder="e.g. 2025"
                          className="mt-1"
                          value={(profile as any).completionYear || ''}
                          onChange={(e) => setProfile({ ...profile, completionYear: e.target.value } as any)}
                        />
                      </div>
                    </>
                  )}

                  {['12th', 'undergraduate', 'postgraduate', 'diploma'].includes(profile.educationLevel) && (
                    <div>
                      <Label htmlFor="stream">
                        {profile.educationLevel === '10th' ? 'Interested Stream' : 'Stream/Specialization'}
                      </Label>
                      <Select
                        value={profile.stream}
                        onValueChange={(value) => setProfile({ ...profile, stream: value })}
                      >
                        <SelectTrigger id="stream" className="mt-1">
                          <SelectValue placeholder="Select stream" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="science_pcm">Science (PCM)</SelectItem>
                          <SelectItem value="science_pcb">Biology (PCB)</SelectItem>
                          <SelectItem value="commerce">Commerce</SelectItem>
                          <SelectItem value="arts">Arts/Humanities</SelectItem>
                          <SelectItem value="computer_science">Computer Science</SelectItem>
                          <SelectItem value="mechanical">Mechanical Engg</SelectItem>
                          <SelectItem value="civil">Civil Engg</SelectItem>
                          <SelectItem value="electrical">Electrical/Electronics</SelectItem>
                          <SelectItem value="medical">Medical (MBBS/BDS)</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="marks">Marks/Percentage/CGPA</Label>
                  <Input
                    id="marks"
                    type="text"
                    placeholder="e.g., 85% or 8.5 CGPA"
                    className="mt-1"
                    value={profile.marks}
                    onChange={(e) => setProfile({ ...profile, marks: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Interests */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="mb-1">Interests & Hobbies</h4>
                  <p className="text-sm text-gray-600">Select areas that interest you (select multiple)</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={profile.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <label htmlFor={interest} className="text-sm cursor-pointer">
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="mb-1">Location</h4>
                  <p className="text-sm text-gray-600">Where are you located?</p>
                </div>

                <div>
                  <Label htmlFor="location">City/District</Label>
                  <Select
                    value={profile.location}
                    onValueChange={(value) => setProfile({ ...profile, location: value })}
                  >
                    <SelectTrigger id="location" className="mt-1">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="coimbatore">Coimbatore</SelectItem>
                      <SelectItem value="madurai">Madurai</SelectItem>
                      <SelectItem value="trichy">Trichy (Tiruchirappalli)</SelectItem>
                      <SelectItem value="salem">Salem</SelectItem>
                      <SelectItem value="tirunelveli">Tirunelveli</SelectItem>
                      <SelectItem value="erode">Erode</SelectItem>
                      <SelectItem value="vellore">Vellore</SelectItem>
                      <SelectItem value="thanjavur">Thanjavur</SelectItem>
                      <SelectItem value="tuticorin">Tuticorin (Thoothukudi)</SelectItem>
                      <SelectItem value="kanyakumari">Kanyakumari</SelectItem>
                      <SelectItem value="tiruppur">Tiruppur</SelectItem>
                      <SelectItem value="karur">Karur</SelectItem>
                      <SelectItem value="namakkal">Namakkal</SelectItem>
                      <SelectItem value="cuddalore">Cuddalore</SelectItem>
                      <SelectItem value="kanchipuram">Kanchipuram</SelectItem>
                      <SelectItem value="chengalpattu">Chengalpattu</SelectItem>
                      <SelectItem value="dharmapuri">Dharmapuri</SelectItem>
                      <SelectItem value="dindigul">Dindigul</SelectItem>
                      <SelectItem value="krishnagiri">Krishnagiri</SelectItem>
                      <SelectItem value="nagapattinam">Nagapattinam</SelectItem>
                      <SelectItem value="ramanathapuram">Ramanathapuram</SelectItem>
                      <SelectItem value="sivaganga">Sivaganga</SelectItem>
                      <SelectItem value="the-nilgiris">The Nilgiris</SelectItem>
                      <SelectItem value="theni">Theni</SelectItem>
                      <SelectItem value="thiruvallur">Thiruvallur</SelectItem>
                      <SelectItem value="tiruvarur">Tiruvarur</SelectItem>
                      <SelectItem value="villupuram">Villupuram</SelectItem>
                      <SelectItem value="virudhunagar">Virudhunagar</SelectItem>
                      <SelectItem value="ariyalur">Ariyalur</SelectItem>
                      <SelectItem value="perambalur">Perambalur</SelectItem>
                      <SelectItem value="pudukkottai">Pudukkottai</SelectItem>
                      <SelectItem value="tenkasi">Tenkasi</SelectItem>
                      <SelectItem value="ranipet">Ranipet</SelectItem>
                      <SelectItem value="tirupathur">Tirupathur</SelectItem>
                      <SelectItem value="kallakurichi">Kallakurichi</SelectItem>
                      <SelectItem value="mayiladuthurai">Mayiladuthurai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Details */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="mb-1">Additional Details</h4>
                  <p className="text-sm text-gray-600">Crucial for government job and scholarship eligibility</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={profile.category}
                      onValueChange={(value) => setProfile({ ...profile, category: value })}
                    >
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                        <SelectItem value="EWS">EWS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profile.gender}
                      onValueChange={(value) => setProfile({ ...profile, gender: value })}
                    >
                      <SelectTrigger id="gender" className="mt-1">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="income">Family Income (Annual)</Label>
                    <Select
                      value={profile.familyIncome}
                      onValueChange={(value) => setProfile({ ...profile, familyIncome: value })}
                    >
                      <SelectTrigger id="income" className="mt-1">
                        <SelectValue placeholder="Select Income Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="< 2.5 Lakhs">&lt; 2.5 Lakhs</SelectItem>
                        <SelectItem value="2.5 - 5 Lakhs">2.5 - 5 Lakhs</SelectItem>
                        <SelectItem value="5 - 8 Lakhs">5 - 8 Lakhs</SelectItem>
                        <SelectItem value="> 8 Lakhs">&gt; 8 Lakhs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="disability"
                      checked={profile.disability}
                      onCheckedChange={(checked) => setProfile({ ...profile, disability: checked as boolean })}
                    />
                    <label htmlFor="disability" className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Person with Disability (PwD)
                    </label>
                  </div>
                </div>

                {/* Skills & Preferences Section */}
                <div className="pt-6 border-t border-gray-100">
                  <h5 className="font-semibold mb-3">Skills & Goals</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="skills">Top Skills (Comma separated)</Label>
                      <Input
                        id="skills"
                        placeholder="e.g. Python, Communication, Drawing"
                        className="mt-1"
                        value={Array.isArray((profile as any).skills) ? (profile as any).skills.join(', ') : (profile as any).skills || ''}
                        onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map((s: string) => s.trim()) } as any)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="languages">Languages Known</Label>
                      <Input
                        id="languages"
                        placeholder="e.g. English, Tamil, Hindi"
                        className="mt-1"
                        value={Array.isArray((profile as any).languages) ? (profile as any).languages.join(', ') : (profile as any).languages || ''}
                        onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(',').map((s: string) => s.trim()) } as any)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredCourses">Preferred Courses</Label>
                      <Input
                        id="preferredCourses"
                        placeholder="e.g. B.E CSE, MBBS, B.Com"
                        className="mt-1"
                        value={Array.isArray((profile as any).preferredCourses) ? (profile as any).preferredCourses.join(', ') : (profile as any).preferredCourses || ''}
                        onChange={(e) => setProfile({ ...profile, preferredCourses: e.target.value.split(',').map((s: string) => s.trim()) } as any)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredLocations">Preferred Study/Work Locations</Label>
                      <Input
                        id="preferredLocations"
                        placeholder="e.g. Chennai, Bangalore, Abroad"
                        className="mt-1"
                        value={Array.isArray((profile as any).preferredLocations) ? (profile as any).preferredLocations.join(', ') : (profile as any).preferredLocations || ''}
                        onChange={(e) => setProfile({ ...profile, preferredLocations: e.target.value.split(',').map((s: string) => s.trim()) } as any)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="preference">Career Preference</Label>
                  <Select
                    value={profile.careerPreference}
                    onValueChange={(value) => setProfile({ ...profile, careerPreference: value })}
                  >
                    <SelectTrigger id="preference" className="mt-1">
                      <SelectValue placeholder="Govt vs Private Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Private">Private Sector Only</SelectItem>
                      <SelectItem value="Government">Government Jobs Only</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>
          </Card>

          {/* Aptitude Test Option */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="mb-1">Take Aptitude Test (Optional)</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Get more accurate career recommendations based on your skills and personality
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-300"
                  onClick={() => navigate('/aptitude-test')}
                >
                  <TrendingUp className="mr-2 w-4 h-4" />
                  Start Aptitude Test
                </Button>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/dashboard')}
            >
              Skip for Now
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary text-white"
            >
              Save & Continue
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
