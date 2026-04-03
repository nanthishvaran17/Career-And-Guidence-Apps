import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  IndianRupee,
  Calendar,
  Search,
  Bookmark,
  BookmarkCheck,
  Building2,
  Filter,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  category: string;
  exam_name?: string;
  eligibility_criteria?: any;
  description?: string;
  website?: string;
  syllabus?: string;
  exam_pattern?: string;
  preparation_books?: string;
  important_dates?: string;
  isEligible?: boolean;
}

interface Internship {
  id: number;
  title: string;
  company: string;
  type: string;
  stipend: string;
  duration?: string;
  location?: string;
  requirements?: string;
  what_you_learn?: string | string[];
  prerequisites_roadmap?: string | string[];
  syllabus?: string;
  link?: string;
}

export function JobsSkills() {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [govtJobs, setGovtJobs] = useState<Job[]>([]);
  const [privateJobs, setPrivateJobs] = useState<any[]>([]); // New state
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || params.get('searchTerm');
    if (q) {
      setSearchTerm(q);
      // The fetchData call is usually inside another useEffect or triggered by search changes.
      // In this component, we can just let the standard fetch happen if it uses searchTerm.
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileStr = localStorage.getItem('userProfile');
        const profile = profileStr ? JSON.parse(profileStr) : {};

        // Fetch Govt Jobs with eligibility
        const govtParams = new URLSearchParams({
          educationLevel: profile.educationLevel || '',
          category: profile.category || ''
        });

        const [govtRes, internRes, skillsRes, jobsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/govt-jobs?${govtParams}`),
          fetch(`${API_BASE_URL}/api/internships`),
          fetch(`${API_BASE_URL}/api/skills`),
          fetch(`${API_BASE_URL}/api/jobs`) // Fetch Private Jobs
        ]);

        if (govtRes.ok) setGovtJobs(await govtRes.json());
        if (internRes.ok) {
          const fetchedInternships = await internRes.json();
          setInternships(fetchedInternships.length > 0 ? fetchedInternships : [
            { id: 101, title: 'AI Engineering Intern', company: 'Google Labs', type: 'Remote / Paid', stipend: '₹40,000/mo', requirements: 'Python, ML Basics', link: '#' },
            { id: 102, title: 'Frontend Developer Intern', company: 'Zoho Corporation', type: 'In-Office (Chennai)', stipend: '₹25,000/mo', requirements: 'React, Tailwind, TS', link: '#' },
            { id: 103, title: 'Data Analyst Trainee', company: 'TCS Analytics', type: 'Hybrid', stipend: '₹15,000/mo', requirements: 'SQL, Excel, PowerBI', link: '#' },
            { id: 104, title: 'Cybersecurity Analyst', company: 'DefensOS', type: 'Remote', stipend: '₹30,000/mo', requirements: 'Networking, Cyber Fundamentals', link: '#' }
          ]);
        }
        if (skillsRes.ok) {
          const fetchedSkills = await skillsRes.json();
          setSkills(fetchedSkills.length > 0 ? fetchedSkills : [
            { id: 201, title: 'Fullstack Web Development', name: 'Fullstack Web Development', category: 'Technology', level: 'Advanced', description: 'Master React, Node.js, and Databases.', roadmap: ['HTML/CSS', 'JS Basics', 'React Desktop', 'Node Backend'], resources: ['FreeCodeCamp', 'MDN Docs'] },
            { id: 202, title: 'Machine Learning Foundations', name: 'Machine Learning Foundations', category: 'Data & AI', level: 'Intermediate', description: 'Train predictive models and AI networks.', roadmap: ['Python', 'Pandas/Numpy', 'Scikit-Learn', 'Deep Learning'], resources: ['Kaggle', 'Google AI'] },
            { id: 203, title: 'Digital Marketing Mastery', name: 'Digital Marketing Mastery', category: 'Business', level: 'Beginner', description: 'Run successful SEO and paid ad campaigns.', roadmap: ['SEO Basics', 'Google Ads', 'Social Media', 'Analytics'], resources: ['HubSpot Academy', 'Google Garage'] }
          ]);
        }
        if (jobsRes.ok) setPrivateJobs(await jobsRes.json());

      } catch (err) {
        console.error("Failed to fetch jobs/skills", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSaveJob = (id: number) => {
    setSavedJobs(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredGovtJobs = govtJobs.filter(j =>
    (j.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.exam_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInternships = internships.filter(i =>
    (i.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSkills = skills.filter(s =>
    (s.title || s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="mb-2">Jobs, Skills & Opportunities</h2>
          <p className="text-gray-600">
            Find jobs, internships, and skill development roadmaps
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search jobs, skills, or internships..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl text-blue-900 font-bold">{filteredGovtJobs.length + 100}+</div>
                <div className="text-sm text-blue-700">Govt Exams</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl text-green-900 font-bold">{filteredInternships.length + 703}+</div>
                <div className="text-sm text-green-700">Internships</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl text-purple-900 font-bold">{filteredSkills.length + 1000}+</div>
                <div className="text-sm text-purple-700">Skills</div>
              </div>
            </div>
          </Card>
        </div>


        {/* Tabs */}
        <Tabs defaultValue="govt" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="govt">
              <Building2 className="w-4 h-4 mr-2" />
              Govt Exams
            </TabsTrigger>
            <TabsTrigger value="internships">
              <GraduationCap className="w-4 h-4 mr-2" />
              Internships
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Award className="w-4 h-4 mr-2" />
              Skills
            </TabsTrigger>
          </TabsList>


          {/* Govt Jobs Tab */}
          <TabsContent value="govt" className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
              <div className="space-y-3">
                {filteredGovtJobs.map((job) => (
                  <Card key={job.id} className="p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="mb-1">{job.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building2 className="w-4 h-4" />
                              {job.category} | Exam: {job.exam_name}
                            </div>
                          </div>
                          {job.isEligible && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Eligible
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{job.description}</p>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedJob(job)}>
                            View Exam Syllabus & Details
                          </Button>
                          <Button size="sm" className="flex-1 gradient-primary text-white" onClick={() => window.open(`https://${job.website}`, '_blank')}>
                            Official Website
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {!loading && filteredGovtJobs.length === 0 && <p className="text-center text-gray-500">No matching government jobs found.</p>}
          </TabsContent>

          {/* Job Details Modal */}
          {selectedJob && (
            <div
              className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedJob(null); }}
            >
              <div className="flex min-h-full items-start justify-center p-4 pt-8">
              <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">

                {/* Floating ✕ — always visible */}
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-gray-800 hover:text-white font-bold text-base shadow-lg transition-colors"
                  title="Close"
                >✕</button>

                {/* Header */}
                <div className="flex items-start p-5 pr-14 border-b bg-white">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                    <Badge variant="secondary" className="mt-1">{selectedJob.category}</Badge>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                <div className="space-y-4">

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Bookmark className="w-4 h-4" /> Syllabus
                    </h3>
                    <p className="text-sm text-blue-800 whitespace-pre-wrap">{selectedJob.syllabus || "Syllabus details available on official website."}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Exam Pattern</h3>
                      <p className="text-sm text-gray-600">{selectedJob.exam_pattern || "See official notification."}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Preparation Books</h3>
                      <p className="text-sm text-gray-600">{selectedJob.preparation_books || "Standard reference books."}</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Important Dates
                    </h3>
                    <div className="text-sm text-yellow-800">
                      {selectedJob.important_dates ? (
                        (() => {
                          try {
                            const dates = JSON.parse(selectedJob.important_dates);
                            return (
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Application Start: {dates.start}</li>
                                <li>Application End: {dates.end}</li>
                                <li>Exam Date: {dates.exam}</li>
                              </ul>
                            );
                          } catch {
                            return selectedJob.important_dates;
                          }
                        })()
                      ) : "Coming Soon"}
                    </div>
                  </div>

                  {/* PYQ Download Section */}
                  {selectedJob.important_dates && (() => {
                    try {
                      const dates = JSON.parse(selectedJob.important_dates);
                      if (dates.pyqs && dates.pyqs.length > 0) {
                        return (
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" /> Previous Year Question Papers
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {dates.pyqs.map((pyq: any, i: number) => (
                                <a
                                  key={i}
                                  href={pyq.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-colors group"
                                >
                                  <div className="w-8 h-8 rounded-md bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-red-600 text-xs font-bold">PDF</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-800 truncate">{pyq.label}</p>
                                    <p className="text-xs text-purple-600">{pyq.year}</p>
                                  </div>
                                  <svg className="w-4 h-4 text-purple-500 group-hover:text-purple-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    } catch {}
                    return null;
                  })()}

                  <div className="flex justify-end gap-3 pt-4 border-t mt-2">
                    <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
                    <Button className="gradient-primary text-white" onClick={() => window.open(`https://${selectedJob.website}`, '_blank')}>
                      Visit Official Website
                    </Button>
                  </div>
                </div>
                </div>
              </div>
              </div>
            </div>
          )}




          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-green-500" /></div>
            ) : (
              <div className="space-y-3">
                {filteredInternships.map((intern) => {
                  const learnList: string[] = typeof intern.what_you_learn === 'string'
                    ? (() => { try { return JSON.parse(intern.what_you_learn as string); } catch { return []; } })()
                    : (intern.what_you_learn as string[] || []);
                  return (
                  <Card key={intern.id} className="p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="mb-1">{intern.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                              <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{intern.company}</span>
                              {intern.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{intern.location}</span>}
                              {intern.duration && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{intern.duration}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSaveJob(intern.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {savedJobs.includes(intern.id) ? (
                              <BookmarkCheck className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{intern.type}</Badge>
                          <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-300 bg-green-50">
                            <IndianRupee className="w-3 h-3" />
                            {intern.stipend}
                          </Badge>
                          {intern.duration && (
                            <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                              ⏱ {intern.duration}
                            </Badge>
                          )}
                        </div>

                        {intern.syllabus && (
                          <div className="mb-3 p-2 bg-gray-50 rounded-md">
                            <p className="text-xs text-gray-500 mb-1 font-semibold">📚 Syllabus / Skills:</p>
                            <p className="text-xs text-gray-700">{intern.syllabus}</p>
                          </div>
                        )}

                        {learnList.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 font-semibold mb-1">✅ What You'll Learn:</p>
                            <div className="flex flex-wrap gap-1">
                              {learnList.slice(0, 3).map((item, i) => (
                                <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{item}</span>
                              ))}
                              {learnList.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">+{learnList.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setSelectedInternship(intern)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 gradient-primary text-white"
                            onClick={() => window.open(intern.link || '#', '_blank')}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                  );
                })}
              </div>
            )}
            {!loading && filteredInternships.length === 0 && <p className="text-center text-gray-500">No internships found.</p>}
          </TabsContent>

          {/* Internship Detail Modal */}
          {selectedInternship && (() => {
            const learnList: string[] = typeof selectedInternship.what_you_learn === 'string'
              ? (() => { try { return JSON.parse(selectedInternship.what_you_learn as string); } catch { return []; } })()
              : (selectedInternship.what_you_learn as string[] || []);
            const roadmap: string[] = typeof selectedInternship.prerequisites_roadmap === 'string'
              ? (() => { try { return JSON.parse(selectedInternship.prerequisites_roadmap as string); } catch { return []; } })()
              : (selectedInternship.prerequisites_roadmap as string[] || []);
            return (
              /* Backdrop: scrollable so modal is never clipped at top */
              <div
                className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
                onClick={(e) => { if (e.target === e.currentTarget) setSelectedInternship(null); }}
              >
                <div className="flex min-h-full items-start justify-center p-4 pt-8">
                <div className="relative w-full max-w-2xl flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">

                  {/* Floating ✕ — always visible top-right */}
                  <button
                    onClick={() => setSelectedInternship(null)}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white font-bold text-base shadow-lg transition-colors"
                    title="Close"
                  >✕</button>

                  {/* ── Header ── */}
                  <div className="flex items-center gap-3 p-5 pr-14 bg-gradient-to-r from-green-500 to-teal-600 flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-white truncate">{selectedInternship.title}</h2>
                      <p className="text-sm text-green-100">{selectedInternship.company} · {selectedInternship.type}</p>
                    </div>
                  </div>

                  {/* ── Badges ── */}
                  <div className="flex flex-wrap gap-2 px-5 py-3 bg-gray-50 border-b flex-shrink-0">
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />{selectedInternship.stipend}
                    </Badge>
                    {selectedInternship.duration && (
                      <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />⏱ {selectedInternship.duration}
                      </Badge>
                    )}
                    {selectedInternship.location && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{selectedInternship.location}
                      </Badge>
                    )}
                  </div>

                  {/* ── Body ── */}
                  <div className="p-5 space-y-4">
                    {selectedInternship.syllabus && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span className="text-base">📚</span> Syllabus / Core Topics
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{selectedInternship.syllabus}</p>
                      </div>
                    )}

                    {learnList.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" /> What You'll Learn
                        </h3>
                        <ul className="space-y-2">
                          {learnList.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {roadmap.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" /> Prerequisites Roadmap
                        </h3>
                        <div className="space-y-3">
                          {roadmap.map((step, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 shadow-sm">
                                {i + 1}
                              </div>
                              <p className="text-sm text-blue-800 pt-1 flex-1">{step.replace(/^Step \d+: /, '')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedInternship.requirements && (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <span className="text-base">📋</span> Requirements
                        </h3>
                        <p className="text-sm text-amber-800 leading-relaxed">{selectedInternship.requirements}</p>
                      </div>
                    )}
                  </div>

                  {/* ── Footer ── */}
                  <div className="flex gap-3 px-5 py-4 border-t bg-gray-50">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedInternship(null)}>Close</Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold"
                      onClick={() => window.open(selectedInternship.link || '#', '_blank')}
                    >🚀 Apply Now</Button>
                  </div>

                </div>
                </div>
              </div>
            );
          })()}


          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-purple-500" /></div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredSkills.map((skill) => (
                  <Card key={skill.id} className="p-5 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setSelectedSkill(skill)}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1 font-bold truncate">{skill.title || skill.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <Badge variant="secondary">{skill.category || 'General'}</Badge>
                          {skill.level && (
                            <Badge variant="outline" className={
                              skill.level === 'Advanced' ? 'text-red-700 border-red-200 bg-red-50' :
                              skill.level === 'Intermediate' ? 'text-yellow-700 border-yellow-200 bg-yellow-50' :
                              'text-green-700 border-green-200 bg-green-50'
                            }>{skill.level}</Badge>
                          )}
                          {skill.duration && (
                            <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{skill.duration}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{skill.description}</p>
                        {skill.certifications && skill.certifications.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-purple-700">
                            <Award className="w-3 h-3" />
                            <span>{skill.certifications.length} certification{skill.certifications.length > 1 ? 's' : ''} available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {!loading && filteredSkills.length === 0 && <p className="text-center text-gray-500">No skills found.</p>}
          </TabsContent>

          {/* Skill Detail Modal */}
          {selectedSkill && (
            <div
              className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedSkill(null); }}
            >
              <div className="flex min-h-full items-start justify-center p-4 pt-8">
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">

                {/* Floating ✕ — always visible */}
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/20 hover:bg-black/50 flex items-center justify-center text-gray-800 hover:text-white font-bold text-base shadow-lg transition-colors"
                  title="Close"
                >✕</button>

                {/* Header */}
                <div className="flex items-center gap-3 p-5 pr-14 border-b bg-gradient-to-r from-purple-500 to-indigo-600">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white truncate">{selectedSkill.title || selectedSkill.name}</h2>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{selectedSkill.level}</span>
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{selectedSkill.category}</span>
                      {selectedSkill.duration && (
                        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{selectedSkill.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedSkill.description}</p>

                  {/* Roadmap */}
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Learning Roadmap
                    </h3>
                    <div className="space-y-2">
                      {(selectedSkill.roadmap || ['Learn Basics', 'Practice Daily', 'Build Projects', 'Get Certified']).map((step: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-sm text-purple-900 flex-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  {selectedSkill.certifications && selectedSkill.certifications.length > 0 && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" /> Certifications to Earn
                      </h3>
                      <div className="space-y-2">
                        {selectedSkill.certifications.map((cert: string, i: number) => {
                          const isFree = cert.toLowerCase().includes('free') || cert.toLowerCase().includes('gratis');
                          const isGoogle = cert.toLowerCase().includes('google');
                          const isMeta = cert.toLowerCase().includes('meta');
                          const isAWS = cert.toLowerCase().includes('aws');
                          const isMicrosoft = cert.toLowerCase().includes('microsoft') || cert.toLowerCase().includes('az-');
                          return (
                            <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200">
                              <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                                style={{ background: isGoogle ? '#4285F4' : isMeta ? '#1877F2' : isAWS ? '#FF9900' : isMicrosoft ? '#00A4EF' : '#6B21A8' }}>
                                {isGoogle ? 'G' : isMeta ? 'M' : isAWS ? '⚡' : isMicrosoft ? 'MS' : '🏆'}
                              </div>
                              <p className="text-xs font-semibold text-gray-800 flex-1">{cert}</p>
                              {isFree && (
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold flex-shrink-0">FREE</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Bookmark className="w-4 h-4" /> Learning Resources
                    </h3>
                    <div className="space-y-2">
                      {(selectedSkill.resources || ['YouTube', 'Udemy', 'Coursera', 'Official Docs']).map((res: string, i: number) => {
                        const isYT = res.toLowerCase().includes('youtube');
                        const isCourse = res.toLowerCase().includes('coursera') || res.toLowerCase().includes('udemy');
                        return (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="text-base">{isYT ? '▶️' : isCourse ? '🎓' : '🔗'}</span>
                            <span className="text-blue-700">{res}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50">
                  <Button variant="outline" onClick={() => setSelectedSkill(null)}>Close</Button>
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                    Start Learning
                  </Button>
                </div>

              </div>
              </div>
            </div>
          )}


          {/* Private Jobs Tab Removed */}




        </Tabs>
      </div>
    </Layout>
  );
}
