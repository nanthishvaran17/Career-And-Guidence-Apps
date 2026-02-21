import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FilterSidebar } from '../components/FilterSidebar'; // Import Sidebar
import {
  GraduationCap,
  Award,
  MapPin,
  Star,
  Search,
  Bookmark,
  BookmarkCheck,
  Filter,
  Loader2,
  ArrowRightLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface Scholarship {
  id: number;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  link?: string;
}

interface College {
  id: number;
  name: string;
  location: string;
  district: string;
  field: string;
  type: string;
  fees: string;
  rating: number;
  website?: string;
  ranking?: string;
  affiliated_university?: string;
  departments?: string;
  infrastructure?: string;
  placement_stats?: string;
  admission_mode?: string;
  reviews?: string;
}

interface School {
  id: number;
  name: string;
  type: string;
  board: string;
  location: string;
  district: string;
  rating: number;
  website?: string;
  address_link?: string;
  fee_structure?: string;
  infrastructure?: string;
  board_results?: string;
  reviews?: string;
}

interface FilterState {
  search: string;
  district: string[];
  category: string[]; // For Colleges: Field, For Schools: Board
  ownership: string[];
  feesRange: [number, number];
}

export function EducationGuidance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schools');
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    district: [],
    category: [],
    ownership: [],
    feesRange: [0, 500000]
  });

  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<number[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  // Consolidated Fetch Function
  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.district.length) queryParams.append('district', filters.district.join(','));
      if (filters.ownership.length) queryParams.append('type', filters.ownership.join(','));

      // Category Mapping based on Tab
      if (activeTab === 'colleges' && filters.category.length) {
        // Map common names to backend fields if necessary, or just pass as stream/field
        // The API expects 'stream' for colleges
        queryParams.append('stream', filters.category.join(','));
      } else if (activeTab === 'schools' && filters.category.length) {
        queryParams.append('board', filters.category.join(','));
      }

      // 1. Fetch Scholarships (always same)
      if (activeTab === 'scholarships') {
        const res = await fetch(`${API_BASE_URL}/api/scholarships`);
        if (res.ok) setScholarships(await res.json());
      }

      // 2. Fetch Colleges
      if (activeTab === 'colleges') {
        const res = await fetch(`${API_BASE_URL}/api/colleges?${queryParams.toString()}`);
        if (res.ok) setColleges(await res.json());
      }

      // 3. Fetch Schools
      if (activeTab === 'schools') {
        const res = await fetch(`${API_BASE_URL}/api/schools?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setSchools(data.schools || data);
        }
      }

    } catch (e) {
      console.error("❌ Education Guidance Fetch Error:", e);
      toast.error("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch & Refetch on Tab/Apply
  useEffect(() => {
    console.log('🔄 Education Guidance - Fetching data for tab:', activeTab);
    fetchData();
  }, [activeTab]); // Fetch when tab changes

  const handleApplyFilters = () => {
    fetchData();
    if (window.innerWidth < 768) setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      district: [],
      category: [],
      ownership: [],
      feesRange: [0, 500000]
    });
    // Trigger fetch after state update (might need effect or direct call, direct call with empty filters here)
    // For simplicity, we just reset state and let user click Apply, or we can auto-apply.
    // Let's auto-apply for better UX.
    // Actually, state update is async, so we can't call fetchData immediately with new state.
    // We'll rely on the user clicking "Apply" or add `filters` to dependency array if we want auto-fetch (but that might be too aggressive).
    // Let's just reset state. User clicks Apply.
  };

  const toggleSaveCollege = (id: string | number) => {
    const idStr = id.toString();
    setSavedColleges(prev => prev.includes(idStr) ? prev.filter(i => i !== idStr) : [...prev, idStr]);
  };

  // Robust JSON parser
  const parseJSON = (data: any, fallback: any) => {
    if (!data) return fallback;
    if (typeof data === 'object') return data;
    try { return JSON.parse(data); } catch (e) { return fallback; }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)]">

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pr-2 order-1 md:order-1">
          {/* Modern Header with Side-by-Side Action Buttons */}
          <div className="mb-6 space-y-4">
            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Education Guidance
                </span>
              </h1>
              <p className="text-gray-600">Explore colleges, scholarships, and learning paths.</p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap gap-3 justify-center items-center">
              {/* Filters Button */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                size="sm"
                variant="outline"
                className="group relative overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300"
              >
                <Filter className="w-4 h-4 mr-2 text-indigo-600 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Filters</span>
                {filters.district.length + filters.category.length > 0 && (
                  <Badge className="ml-2 bg-indigo-600 text-white animate-pulse">
                    {filters.district.length + filters.category.length}
                  </Badge>
                )}
              </Button>

              {/* Compare Tool Button */}
              <Button
                onClick={() => navigate('/comparison')}
                size="sm"
                className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                <ArrowRightLeft className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Compare</span>
              </Button>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 z-50 bg-white p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="ghost"
                  size="sm"
                >
                  ✕ Close
                </Button>
              </div>
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                onClose={() => setShowFilters(false)}
                activeTab={activeTab}
              />
            </div>
          )}

          <div className="relative max-w-2xl mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by name, location..."
              className="pl-10"
              value={filters.search} // Bind to filter state
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="schools"><GraduationCap className="w-4 h-4 mr-2" /> Schools</TabsTrigger>
              <TabsTrigger value="colleges"><GraduationCap className="w-4 h-4 mr-2" /> Colleges</TabsTrigger>
              <TabsTrigger value="scholarships"><Award className="w-4 h-4 mr-2" /> Scholarships</TabsTrigger>
            </TabsList>

            <TabsContent value="schools" className="space-y-6">
              {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {schools.map((school) => {
                    const fees = parseJSON(school.fee_structure, {});
                    const infra = parseJSON(school.infrastructure, []);
                    return (
                      <Card key={school.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden flex flex-col h-full">
                        <div className="p-5 flex flex-col h-full space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h3 className="font-bold text-lg text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                                {school.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                <span className="truncate">{school.district}</span>
                                <span className="text-gray-300">•</span>
                                <span className="truncate">{school.type}</span>
                              </div>
                              <div className="pt-1">
                                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">{school.board}</Badge>
                              </div>
                            </div>
                            <Badge className="bg-green-600 hover:bg-green-700 text-white gap-1 px-2 shrink-0">
                              {school.rating} <Star className="w-3 h-3 fill-current" />
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Annual Fees</p>
                              <p className="font-semibold text-gray-900 text-sm truncate" title={fees.tuition}>{fees.tuition || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-purple-600 mb-1">Results (12th)</p>
                              <p className="font-semibold text-purple-700 text-sm">{parseJSON(school.board_results, {}).pass_percentage_12th || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="flex-1">
                            {infra.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {infra.slice(0, 3).map((item: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 font-normal text-xs hover:bg-gray-200">
                                    {item}
                                  </Badge>
                                ))}
                                {infra.length > 3 && (
                                  <span className="text-xs text-gray-400 self-center">+{infra.length - 3}</span>
                                )}
                              </div>
                            ) : (
                              <div className="h-6"></div> /* Spacer if no infra */
                            )}
                          </div>

                          <Button asChild className="w-full gradient-primary text-white shadow-md hover:shadow-lg transition-all mt-auto">
                            <a href={school.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                  {schools.length === 0 && !loading && <p className="text-gray-500">No schools found matching your filters.</p>}
                </div>
              )}
            </TabsContent>

            <TabsContent value="colleges" className="space-y-6">
              {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {colleges.map((college) => {
                    const depts = parseJSON(college.departments, []);
                    const placement = parseJSON(college.placement_stats, {});
                    return (
                      <Card key={college.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden flex flex-col h-full">
                        <div className="p-5 flex flex-col h-full space-y-4">
                          {/* Header */}
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h3 className="font-bold text-lg text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                                {college.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                <span className="truncate">{college.district}</span>
                                <span className="text-gray-300">•</span>
                                <span className="truncate">{college.type}</span>
                                {college.ranking && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-amber-600 font-medium truncate">{college.ranking}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <Badge className="bg-green-600 hover:bg-green-700 text-white gap-1 px-2">
                                {college.rating} <Star className="w-3 h-3 fill-current" />
                              </Badge>
                              <button onClick={() => toggleSaveCollege(college.id)} className="text-gray-400 hover:text-blue-600 transition-colors">
                                {savedColleges.includes(String(college.id)) ? <BookmarkCheck className="w-5 h-5 text-blue-600" /> : <Bookmark className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {/* Stats Grid - Enhanced */}
                          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Fees</p>
                              <p className="font-semibold text-gray-900 text-sm truncate" title={college.fees}>{college.fees}</p>
                            </div>
                            <div>
                              <p className="text-xs text-blue-600 mb-1">Avg Package</p>
                              <p className="font-semibold text-blue-700 text-sm">
                                {placement.average_package || placement.avg || 'N/A'}
                              </p>
                            </div>
                            {placement.highest_package && (
                              <div className="col-span-2 border-t pt-2 mt-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Highest: <span className="font-medium text-gray-900">{placement.highest_package}</span></span>
                                  <span className="text-green-600 font-medium">{placement.placement_percentage} Placed</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Departments Tags */}
                          <div className="flex-1">
                            {depts.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {depts.slice(0, 3).map((d: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 font-normal text-xs hover:bg-gray-200">
                                    {d}
                                  </Badge>
                                ))}
                                {depts.length > 3 && <span className="text-xs text-gray-400 self-center">+{depts.length - 3}</span>}
                              </div>
                            ) : (
                              <div className="h-6"></div>
                            )}
                          </div>

                          {/* Reviews Snippet (New) */}
                          {(() => {
                            const reviews = parseJSON(college.reviews, []);
                            if (reviews.length > 0) {
                              return (
                                <div className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2 line-clamp-2">
                                  "{reviews[0].comment}" <span className="not-italic font-medium">- {reviews[0].user}</span>
                                </div>
                              );
                            }
                            return null;
                          })()}


                          {/* Action */}
                          <Button asChild className="w-full gradient-primary text-white shadow-md hover:shadow-lg transition-all mt-auto">
                            <a href={college.website} target="_blank" rel="noopener noreferrer">Visit Official Website</a>
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                  {colleges.length === 0 && !loading && <p className="text-gray-500">No colleges found matching your filters.</p>}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scholarships">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map(s => (
                  <Card key={s.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden flex flex-col h-full">
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                          <Award className="w-6 h-6" />
                        </div>
                        {s.deadline && <Badge variant="outline" className="text-xs border-red-200 text-red-600 bg-red-50">Deadline: {s.deadline}</Badge>}
                      </div>

                      <div className="mb-4 flex-1">
                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{s.title}</h4>
                        <p className="text-sm text-gray-500">{s.provider}</p>
                      </div>

                      <div className="space-y-4 mt-auto">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <p className="text-xs text-green-600 mb-1 font-medium">Scholarship Amount</p>
                          <p className="font-bold text-green-700">{s.amount}</p>
                        </div>

                        <Button asChild className="w-full gradient-primary text-white shadow-sm hover:shadow-md">
                          <a href={s.link} target="_blank" rel="noopener noreferrer">Apply Now</a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

          </Tabs>
        </div>

        {/* Sidebar - Desktop (Right Side) */}
        <div className="hidden md:block w-56 flex-shrink-0 border rounded-lg bg-white h-full overflow-hidden shadow-sm order-2 md:order-2">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            activeTab={activeTab}
          />
        </div>

      </div >
    </Layout >
  );
}
