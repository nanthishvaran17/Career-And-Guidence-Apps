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
  requirements?: string;
  link?: string;
}

export function JobsSkills() {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [govtJobs, setGovtJobs] = useState<Job[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);

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

        const [govtRes, internRes, skillsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/govt-jobs?${govtParams}`),
          fetch(`${API_BASE_URL}/api/internships`),
          fetch(`${API_BASE_URL}/api/skills`)
        ]);

        if (govtRes.ok) setGovtJobs(await govtRes.json());
        if (internRes.ok) setInternships(await internRes.json());
        if (skillsRes.ok) setSkills(await skillsRes.json());

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
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.exam_name && j.exam_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredInternships = internships.filter(i =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSkills = skills.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl text-blue-900">{filteredGovtJobs.length}</div>
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
                <div className="text-2xl text-green-900">{filteredInternships.length}</div>
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
                <div className="text-2xl text-purple-900">{filteredSkills.length}</div>
                <div className="text-sm text-purple-700">Skills</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="govt" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="govt">
              <Briefcase className="w-4 h-4 mr-2" />
              Govt Jobs
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-6 relative animate-in fade-in zoom-in-95">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
                <Badge variant="secondary" className="mb-6">{selectedJob.category}</Badge>

                <div className="space-y-6">

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

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
                    <Button className="gradient-primary text-white" onClick={() => window.open(`https://${selectedJob.website}`, '_blank')}>
                      Visit Official Website
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-green-500" /></div>
            ) : (
              <div className="space-y-3">
                {filteredInternships.map((job) => (
                  <Card key={job.id} className="p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="mb-1">{job.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building2 className="w-4 h-4" />
                              {job.company}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {savedJobs.includes(job.id) ? (
                              <BookmarkCheck className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{job.type}</Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            {job.stipend}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 gradient-primary text-white"
                            onClick={() => window.open(job.link || '#', '_blank')}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {!loading && filteredInternships.length === 0 && <p className="text-center text-gray-500">No internships found.</p>}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-purple-500" /></div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredSkills.map((skill) => (
                  <Card key={skill.id} className="p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedSkill(skill)}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1 font-bold">{skill.title}</h4>
                        <Badge variant="secondary" className="mb-2">{skill.category}</Badge>
                        <p className="text-sm text-gray-600 line-clamp-2">{skill.description}</p>
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-6 relative animate-in fade-in zoom-in-95">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-2">{selectedSkill.title}</h2>
                <div className="flex gap-2 mb-4">
                  <Badge>{selectedSkill.level}</Badge>
                  <Badge variant="outline">{selectedSkill.category}</Badge>
                </div>

                <p className="text-gray-700 mb-6">{selectedSkill.description}</p>

                <div className="space-y-6">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Learning Roadmap
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-purple-900">
                      {selectedSkill.roadmap.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Bookmark className="w-4 h-4" /> Resources
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 text-blue-600">
                      {selectedSkill.resources.map((res: string, i: number) => (
                        <li key={i}><a href="#" className="hover:underline">{res}</a></li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button onClick={() => setSelectedSkill(null)}>Close</Button>
                </div>
              </Card>
            </div>
          )}

        </Tabs>
      </div>
    </Layout>
  );
}
