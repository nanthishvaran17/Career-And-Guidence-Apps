import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  GraduationCap,
  Award,
  MapPin,
  DollarSign,
  Star,
  Search,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Filter,
  Loader2
} from 'lucide-react';
/* import { colleges } from '../data/mockData'; - REMOVED */

interface Scholarship {
  id: number;
  title: string; // Changed from name
  provider: string; // Added
  amount: string;
  eligibility_criteria: string; // Changed from eligibility
  deadline: string;
  link?: string; // Added
  isEligible?: boolean;
}

const cleanIncome = (incomeStr: string) => {
  if (incomeStr.includes('< 2.5')) return 200000;
  if (incomeStr.includes('2.5 - 5')) return 400000;
  if (incomeStr.includes('5 - 8')) return 700000;
  if (incomeStr.includes('> 8')) return 900000;
  return 9999999;
};

interface College {
  id: number;
  name: string;
  location: string;
  field: string;
  type: string;
  fees: string;
  rating: number;
  website?: string;
  details_link?: string;
  accommodation?: string;
  placement_stats?: {
    average_package: string;
    highest_package: string;
    placement_percentage: string;
  };
  reviews?: {
    user: string;
    rating: number;
    comment: string;
  }[];
  ranking?: string;
}

export function EducationGuidance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<number[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const profileStr = localStorage.getItem('userProfile');
        const profile = profileStr ? JSON.parse(profileStr) : {};
        const incomeValue = cleanIncome(profile.familyIncome || '');

        const scholarshipParams = new URLSearchParams({
          income: incomeValue.toString(),
          category: profile.category || '',
          marks: profile.marks || '0',
          gender: profile.gender || '',
          disability: profile.disability ? 'true' : 'false'
        });

        // Independent fetches to prevent one failure from blocking the other
        try {
          const scholarshipsRes = await fetch(`${API_BASE_URL}/api/scholarships?${scholarshipParams}`);
          if (scholarshipsRes.ok) {
            const data = await scholarshipsRes.json();
            setScholarships(data);
          } else {
            console.error("Scholarships API failed");
          }
        } catch (e) {
          console.error("Scholarships Network Error", e);
        }

        try {
          const collegesRes = await fetch(`${API_BASE_URL}/api/colleges`);
          if (collegesRes.ok) {
            const data = await collegesRes.json();
            setColleges(data);
          } else {
            console.error("Colleges API failed");
            throw new Error("Failed to load colleges");
          }
        } catch (e) {
          console.error("Colleges Network Error", e);
          setError("Could not connect to server. Please check if backend is running.");
        }

      } catch (err) {
        console.error("General Fetch Error", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSaveCollege = (id: string | number) => {
    const idStr = id.toString();
    setSavedColleges(prev =>
      prev.includes(idStr) ? prev.filter(i => i !== idStr) : [...prev, idStr]
    );
  };

  const toggleSaveScholarship = (id: number) => {
    setSavedScholarships(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Client-side filtering with defensive checks
  const filteredColleges = (colleges || []).filter(c => {
    if (!c) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(term) ||
      (c.location || '').toLowerCase().includes(term) ||
      (c.field || '').toLowerCase().includes(term)
    );
  });

  const filteredScholarships = (scholarships || []).filter(s => {
    if (!s) return false;
    const term = searchTerm.toLowerCase();
    return (
      (s.title || '').toLowerCase().includes(term) ||
      (s.eligibility_criteria || '').toLowerCase().includes(term)
    );
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="mb-2">Education Guidance</h2>
          <p className="text-gray-600">
            Find the best colleges, courses, and scholarships for your career path
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search colleges, courses, or scholarships..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Connection Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="colleges" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="colleges">
              <GraduationCap className="w-4 h-4 mr-2" />
              Colleges
            </TabsTrigger>
            <TabsTrigger value="scholarships">
              <Award className="w-4 h-4 mr-2" />
              Scholarships
            </TabsTrigger>
          </TabsList>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredScholarships.length} scholarships found
              </p>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-yellow-500" /></div>
            ) : (
              <div className="space-y-3">
                {filteredScholarships.map((scholarship: Scholarship) => (
                  <Card key={scholarship.id} className="p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="mb-1 text-lg font-bold">{scholarship.title}</h4>
                            <div className="flex gap-2 mb-2">
                              <Badge variant="secondary">{scholarship.provider || 'Scholarship'}</Badge>
                              {scholarship.isEligible ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Eligible</Badge>
                              ) : (
                                <Badge variant="outline" className="text-gray-500">Check Eligibility</Badge>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSaveScholarship(scholarship.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {savedScholarships.includes(scholarship.id) ? (
                              <BookmarkCheck className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Bookmark className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-start gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <span className="text-gray-600">Amount: </span>
                              <span className="text-green-600 font-medium">{scholarship.amount}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <span className="text-gray-600">Eligibility: </span>
                              <span>{scholarship.eligibility_criteria}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <span className="text-gray-600">Deadline: </span>
                              <span className="text-red-600">{scholarship.deadline}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <a href={scholarship.link || '#'} target="_blank" rel="noopener noreferrer">
                              View Details
                            </a>
                          </Button>
                          <Button size="sm" className="gradient-primary text-white flex-1" asChild>
                            <a href={scholarship.link || '#'} target="_blank" rel="noopener noreferrer">
                              Apply Now
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredScholarships.length === 0 && (
              <Card className="p-12 text-center">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No scholarships found matching your criteria.</p>
              </Card>
            )}
          </TabsContent>

          {/* Colleges Tab with Safe Checks */}
          <TabsContent value="colleges" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredColleges.length} colleges found
              </p>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredColleges.map((college) => (
                <Card key={college.id} className="p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-gray-800">{college.name}</h4>
                        {college.ranking && <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">{college.ranking}</Badge>}
                      </div>
                      <div className="flex items-center text-sm text-yellow-500">
                        <span className="font-bold mr-1">{college.rating}</span>
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-gray-400 ml-2 text-xs">({college.reviews?.length || 0} reviews)</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveCollege(college.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {savedColleges.includes(String(college.id)) ? (
                        <BookmarkCheck className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Department:</span>
                      <span className="font-semibold text-indigo-600 max-w-[60%] text-right truncate">{college.field}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Fees:</span>
                      <span className="font-semibold text-green-600">{college.fees}</span>
                    </div>
                    {college.accommodation && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">Accommodation:</span>
                        <span className="font-semibold text-blue-600 max-w-[60%] text-right truncate">{college.accommodation}</span>
                      </div>
                    )}

                    {/* Placement Stats Section */}
                    {college.placement_stats && (
                      <div className="bg-green-50 p-3 rounded-md border border-green-100">
                        <h5 className="text-xs font-semibold text-green-800 mb-2 uppercase tracking-wider">Placement Stats</h5>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-xs text-gray-500">Avg Pkg</div>
                            <div className="font-bold text-gray-800 text-sm">{college.placement_stats.average_package}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Highest</div>
                            <div className="font-bold text-gray-800 text-sm">{college.placement_stats.highest_package}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Placed</div>
                            <div className="font-bold text-green-600 text-sm">{college.placement_stats.placement_percentage}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Review Snippet */}
                    {college.reviews && college.reviews.length > 0 && (
                      <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 italic border border-gray-100">
                        "{college.reviews[0].comment}" - {college.reviews[0].user}
                      </div>
                    )}

                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={college.details_link || '#'} target="_blank" rel="noopener noreferrer">
                        View Details
                      </a>
                    </Button>
                    <Button className="flex-1 gradient-primary text-white" asChild>
                      <a href={college.website || '#'} target="_blank" rel="noopener noreferrer">
                        Apply Now
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            {filteredColleges.length === 0 && (
              <Card className="p-12 text-center">
                <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No colleges found. Try a different search term.</p>
              </Card>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </Layout>
  );
}
